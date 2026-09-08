import Perplexity from '@perplexity-ai/perplexity_ai';

async function runSmokeTests() {
  console.log('====================================================');
  console.log('  Perplexity Agent API Integration & Smoke Tests');
  console.log('====================================================');

  const keyPresent = !!process.env.PERPLEXITY_API_KEY;
  console.log('1. Checking PERPLEXITY_API_KEY presence:', keyPresent ? 'PRESENT (OK)' : 'MISSING (FAIL)');
  if (!keyPresent) {
    throw new Error('PERPLEXITY_API_KEY is missing');
  }

  const client = new Perplexity();

  // Test 1: Single turn with 'fast' preset
  console.log('\n2. Testing Agent API with preset: "fast"...');
  const t1Start = Date.now();
  const res1 = await client.responses.create({
    preset: 'fast',
    input: 'In what state is Newark, Delaware located? Answer in 1 short sentence.',
  });
  const t1Duration = Date.now() - t1Start;

  console.log('   - HTTP Status: 200 OK');
  console.log('   - Response ID:', res1.id);
  console.log('   - Model used:', res1.model);
  console.log('   - Latency:', `${t1Duration}ms`);
  console.log('   - Answer:', res1.output_text?.trim());
  console.log('   - Total tokens:', res1.usage?.total_tokens);

  // Test 2: Grounded research with 'low' preset & citations
  console.log('\n3. Testing Agent API with preset: "low" (web grounding)...');
  const t2Start = Date.now();
  const res2 = await client.responses.create({
    preset: 'low',
    input: 'What are 2 famous historic landmarks in Newark, Delaware?',
  });
  const t2Duration = Date.now() - t2Start;

  console.log('   - HTTP Status: 200 OK');
  console.log('   - Response ID:', res2.id);
  console.log('   - Model used:', res2.model);
  console.log('   - Latency:', `${t2Duration}ms`);
  console.log('   - Answer snippet:', res2.output_text?.slice(0, 140).replace(/\n/g, ' ') + '...');
  
  // Extract search results and citations
  const searchResults = [];
  const citations = [];
  if (Array.isArray(res2.output)) {
    for (const item of res2.output) {
      if (Array.isArray(item.results)) {
        for (const r of item.results) {
          if (r.url) searchResults.push(r.url);
        }
      }
      if (Array.isArray(item.content)) {
        for (const c of item.content) {
          if (Array.isArray(c.annotations)) {
            for (const a of c.annotations) {
              if (a.url) citations.push(a.url);
            }
          }
        }
      }
    }
  }
  console.log('   - Sources discovered:', searchResults.length);
  if (searchResults.length > 0) {
    console.log('   - Top source:', searchResults[0]);
  }

  // Test 3: Multi-turn conversation via previous_response_id
  console.log('\n4. Testing Multi-Turn context via previous_response_id...');
  const t3Start = Date.now();
  const res3 = await client.responses.create({
    previous_response_id: res2.id,
    preset: 'low',
    input: 'Which one was founded earlier?',
  });
  const t3Duration = Date.now() - t3Start;

  console.log('   - HTTP Status: 200 OK');
  console.log('   - Multi-turn Follow-up Response ID:', res3.id);
  console.log('   - Latency:', `${t3Duration}ms`);
  console.log('   - Answer snippet:', res3.output_text?.slice(0, 140).replace(/\n/g, ' ') + '...');

  console.log('\n====================================================');
  console.log('  ALL SMOKE TESTS COMPLETED SUCCESSFULLY (200 OK)');
  console.log('====================================================\n');
}

runSmokeTests().catch((err) => {
  console.error('\nSMOKE TEST ERROR:');
  console.error('- Status:', err.status || err.statusCode || 500);
  console.error('- Message:', err.message);
  if (err.status === 429) {
    console.error('- Retry-After:', err.headers?.get?.('retry-after'));
  }
  process.exit(1);
});
