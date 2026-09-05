import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const REGULAR_MENU = `
### Appetizers
- French Fries: $4.99
- Cheese Fries: $5.99
- Old Bay Fries: $5.99
- Onion Rings: $5.99
- Cheesesteak Fries: $12.99
- Mega Fries: $9.99 - Topped with bacon, mozzarella cheese, and choice of sour cream or salsa
- Buffalo Chicken: $10.99
- Pizza Fries: $7.99
- Jalapeno Poppers: $8.99 - 6 pieces
- Mac & Cheese Bites: $8.99 - 9 pieces
- Carne Asada: $17.99 - Tender flare steak
- Nachos: $11.99 - Steak or chicken
- Fajitas: $17.99 - All fajitas grilled onions, green peppers, and peppers
- Garlic Bread: $3.99
- Bread Sticks: $4.99 - 4 pieces
- Garlic Knots: $7.99 - 7 pieces
- Mozzarella Sticks: $8.99 - 6 pieces
- Broccoli Bites: $8.99 - 10 pieces
- Fried Mushrooms: $7.99 - 7 pieces
- Chicken Tenders: $11.99 - 3 pieces
- Fried Calamari: $11.99
- Fried Shrimp: $10.99
- Sampler Platter: $16.99 - Mozzarella sticks, Jalapeno Poppers, Mac & Cheese Bites
- Octopus Skins: $8.99 - 4 pieces, Jalapenos, Broccoli, Cheese
- Cinnamon Bites: $10.99

### Breakfast
- House: $10.99 - 2 eggs, home fries, toast
- Ham Steak: $11.99 - 3 eggs, 3 large shrimp & 2 eggs
- Seafood Omelette: $12.99 - Shrimp & Crab Meat
- Crab Meat: $12.99 - 3 eggs
- Steak & Eggs: $22.99 - 2 eggs, home fries, toast
- Belgian Waffles: $11.99 - Waffle with home fries & toast
- French Toast: $6.99 - 2 slices
- Pancakes: $7.99 - 2 pancakes

### Cheesesteaks
- Philadelphia Cheesesteak: $10.99 - Fresh homemade 8oz beef burgers on burger bun
- The Philly Special: $12.99 - Mushrooms, sweet peppers, onions
- Cheesesteak Ranchero: $12.99 - Jalapeños, ranch dressing
- Pizza Steak or Chicken: $12.99 - Marinara sauce & mozzarella cheese
- BBQ Chicken Cheesesteak: $12.99 - BBQ sauce and Grande mozzarella
- Italian Vegetable Cheesesteak: $12.99 - Fresh vegetables
- Ham & American Cheese: $12.99 - Classic combo

### Chicken Wings
- Plain Chicken Wings: $8.99 - Jumbo wings
- BBQ Wings: $8.99 - BBQ sauce
- Garlic Parmesan Wings: $8.99 - Garlic parmesan sauce
- Spicy Wings: $8.99 - Hot sauce
- Honey Habanero Wings: $8.99 - Sweet & spicy
- Mango Habanero Wings: $8.99 - Tropical sweet heat

### Complete Dinners
- Chicken Finger Platter: $13.99 - Served with Garlic Bread, Salad and Fries
- Shrimp Basket: $14.99
- Jumbo Shrimp Platter: $15.99
- Crab Cake Platter: $19.99
- Flounder Platter: $14.99
- Fried Seafood Combo: $27.99 - Flounder, shrimp, and crab cake
- Beef Shish Kebab: $22.99 - With rice
- Chicken Shish Kebab: $19.99 - With rice
- Gyro Platter: $19.99 - With rice & Greek salad

### Desserts
- Strawberry Cheesecake: $5.99
- Carrot Cake: $5.99
- Chocolate Cake: $5.99
- Tiramisu: $5.99
- Rice or Bread Pudding: $5.99
- Zeppoli: $5.99 - Powdered or Cinnamon Sugar

### Drinks
- 2-liter Soda: $3.99
- Can Soda: $1.0
- 20oz Bottle: $2.75

### Fresh Burgers
- Burger: $7.99 - Fresh homemade 8oz beef burger on burger bun
- Cheeseburger: $8.99 - With American cheese
- Double Cheeseburger: $11.99 - Double patty with American cheese
- Bacon Double Cheeseburger: $14.99 - Bacon, double patty, cheese
- Texas Cheeseburger: $12.99 - Jalapenos, onion rings, and Texas sauce
- Chicken Ranch Burger: $11.99 - Ranch & bacon
- Chicken Caesar: $11.99 - Caesar dressing

### Fresh Salads
- Small Garden Salad: $4.99
- Garden Salad: $8.99
- Grilled or Crispy Chicken Salad: $12.99
- Avocado Grilled Chicken Salad: $13.99
- Grilled Shrimp Salad: $15.99
- Grilled Chicken and Shrimp Combo Salad: $16.99
- Caesar Salad: $8.99
- Chef Salad: $12.99
- Grilled Chicken Caesar Salad: $12.99
- Crispy Chicken Caesar Salad: $12.99
- Greek Salad: $11.99
- Greek Salad with Grilled Chicken: $13.99
- Steak Salad: $13.99
- Antipasto Salad: $12.99
- Cobb Salad: $14.99

### Gourmet Pizza
- Our Signature Thin Crust: $21.99 - The Works Pizza
- The Works Pizza: $21.99 - Meat, green pepper, mushrooms, and fried onions
- White Special Pizza: $21.99 - Spinach, ricotta, mozzarella cheese and fresh garlic sauce
- Buffalo Chicken Pizza: $21.99 - Grilled chicken, buffalo sauce
- Chicken Ranch Pizza: $21.99 - Grilled chicken with ranch dressing
- Chicken Parm Pizza: $21.99 - Grilled or crispy chicken with mozzarella cheese, and sauce
- Chicken Alfredo Pizza: $21.99 - Grilled chicken, Alfredo sauce
- Shrimp Alfredo Pizza (XL): $25.99 - Fresh shrimp, Alfredo and Grande mozzarella
- Greek Pizza: $21.99 - Spinach, feta cheese topped with spinach
- House Pizza: $21.99 - Fresh green peppers, onions, mozzarella cheese, and fried onions
- Philly Cheesesteak Pizza: $23.99 - Sliced steak, American cheese, onion
- Veggie Pizza: $21.99 - Fresh green peppers, onions, mushrooms

### Hot Sandwiches
- Italian Sausage Parm: $12.99 - Hot sausage with provolone cheese sauce
- Special Chicken Cutlet: $12.99 - Onions, tomatoes, American cheese, and ranch dressing
- Meatball Parm: $12.99 - Homemade meatballs
- Cheeseburger Sandwich: $12.99 - 1/2 oz of burger with American cheese
- Flounder Sandwich: $12.99 - Fresh flounder breaded to perfection with tartar sauce
- Crispy Chicken: $12.99
- Chicken Cheesesteak: $12.99 - Lettuce and tomatoes

### Latin Food
- Tacos: $11.99 - Choice of boneless / chicken tenders
- Burritos: $11.99 - With cilantro, onions, and salsa
- Empanadas: $11.99 - 3 pieces
- Pupusas: $11.99 - 3 pieces
- Nachos: $11.99 - Steak or chicken
- Carne Asada: $17.99 - Steak
- Shrimp: $19.99
- Combination: $24.99 - Chicken, steak, shrimp

### Pasta
- Spaghetti with Meat Sauce: $16.99
- Chicken Parmigiana: $17.99 - With pasta
- Shrimp Parmigiana: $19.99 - With pasta
- Seafood with Pasta: $22.99
- Baked Ravioli: $14.99 - Sauce & Mozzarella
- Lobster Ravioli: $19.99 - Rose sauce & Mozzarella
- Baked Ziti: $14.99 - Sauce & Mozzarella
- Eggplant Parmigiana: $14.99 - With pasta
- Italian Trio: $19.99 - Sausage, meatball, cheese ravioli, and meatball

### Pizza
- Plain Cheese Pizza: $18.99 - 100% Grande Mozzarella
- White Cheese Pizza: $19.99 - Ricotta, mozzarella cheese and Grande mozzarella
- Pizza by the Slice: $2.5 - 1 slice of pizza
- 2 Slices + Can Drink: $6.0 - 2 slices of pizza with a can of soda

### Quesadillas
- Chicken & Steak Quesadilla: $13.99
- Crab Quesadilla: $15.99
- BBQ Chicken Quesadilla: $12.99
- Texas Chicken Quesadilla: $12.99
- Buffalo Chicken Quesadilla: $12.99
- Steak Quesadilla: $12.99
- Seafood Quesadilla: $15.99

### Seafood
- Fried Seafood Combo: $16.99 - 21 Shrimp, 2 Crab Cake, 1 Flounder
- Fried Filet of Flounder: $14.99 - 1 piece
- Crab Cake Dinner: $26.99 - 2 pieces

### Sicilian Pizza
- White Cheese Sicilian: $18.99 - 100% Grande Mozzarella, thick crust
- Sicilian Meat Lover: $23.99 - Sausage, ham, pepperoni, bacon
- Sicilian Special: $25.99 - Pepperoni, sausage, green peppers, mushrooms
- Shrimp Alfredo Sicilian: $25.99 - Fresh shrimp, Alfredo sauce and Grande mozzarella
- Buffalo Chicken Sicilian: $23.99 - Grilled chicken, hot sauce and Grande mozzarella
- Chicken Ranch Sicilian: $23.99 - Grilled chicken, ranch, mozzarella and bacon
- Ham & American Cheese Sicilian: $21.99
- White Special Sicilian: $23.99 - Spinach, tomato, fresh garlic sauce and Grande mozzarella
- Philly Steak Sicilian: $23.99 - Grilled chicken, hot sauce and Grande mozzarella

### Side Orders
- Broccoli: $5.99
- Rice: $5.99
- Fried Beans: $5.99
- Sausage: $5.99
- Meatball: $5.99
- Herr's Chips: $2.99

### Soups
- Home Soup: $5.99 - 16oz
- Soup of the Day: $5.99

### Strombolis + Calzones
- Cheese Calzone: $14.99 - Stuffed with Ricotta & Grande Mozzarella
- Ham & Cheese Calzone: $15.99
- Italian Calzone: $15.99
- Cheese Stromboli: $14.99
- Chicken Stromboli: $15.99
- Buffalo Chicken Stromboli: $15.99
- Italian Stromboli: $15.99
- Meat Lovers Stromboli: $15.99
- Vegetable Stromboli: $14.99
- Philly Special Stromboli: $18.99 - Cheese, peppers, onions & mushrooms
- Philly Special Chicken Stromboli: $18.99 - Cheese, peppers, onions & mushrooms

### Subs + Grinders
- Italian Sub: $12.99 - Ham, capicola, Genoa salami, and American cheese
- Turkey Club: $12.99 - With cheese
- Turkey Bacon Club: $12.99 - With cheese
- Grilled Chicken BLT Club: $12.99
- American Cheese Club: $12.99 - With bacon
- BLT Club: $12.99
- Tuna Club: $12.99
- Fish Taco on Pita: $12.99
- Ham & American Cheese on Pita: $12.99
`;

const SPECIALS_MENU = `
### Current Deals & Coupon Specials
- 2 XL Pizzas (1 Topping Each): $32.99
- Large 1 Topping Pizza & 20 Wings: $37.99
- 2 Large 1 Topping Pizzas, 20 Wings & Soda: $52.99
- Large 1 Topping Pizza & 10 Wings: $29.99
- Large Cheese Pizza with 3 Toppings: $19.99
- 2 XL Cheese Pizzas & 20 Wings: $64.99
- $5 OFF with Purchase of $40 or more (SAVE $5)
`;

const CATERING_MENU = `
### Catering Subs & Wraps (Serves Half: 8-10, Full: 15-20)
- Sub Tray: Half $50.00 | Full $90.00 - Assortment of fresh subs
- Wrap Tray: Half $50.00 | Full $90.00 - Assortment of fresh wraps

### Catering Appetizers (Serves Half: 8-10, Full: 15-20)
- Cinnamon Bites: Half $45.00 | Full $90.00
- Jalapeno Poppers: Half $80.00 | Full $170.00 - Served with Ranch
- Onion Rings: Half $34.99 | Full $84.99 - Served with Texas Sauce
- Mac & Cheese Bites: Half $34.99 | Full $84.99 - Served with Marinara
- Mozzarella Sticks: Half $110.00 | Full $220.00 - Served with Marinara
- Buffalo Mozzarella Sticks: Half $120.00 | Full $230.00 - Spicy buffalo-style
- Garlic Knots: Half $60.00 | Full $90.00 - Served with Marinara
- Bread Sticks: Half $60.00 | Full $110.00 - Served with Marinara
- Buffalo Tenders: Half $80.00 | Full $180.00 - Tossed in buffalo sauce
- Mozzarella Bread: Half $34.99 | Full $84.99 - Served with Marinara
- Broccoli Bites: Half $80.00 | Full $120.00 - Served with Ranch
- Fried Mushrooms: Half $60.00 | Full $120.00 - Served with Ranch
- Buffalo Calamari: Half $120.00 | Full $235.00 - Served with Ranch
- Fried Calamari: Half $120.00 | Full $210.00 - Served with Texas Sauce
- Jumbo Shrimp: Half $80.00 | Full $200.00 - Served with Cocktail Sauce
- Plain Shrimp Basket: Half $80.00 | Full $180.00 - Served with Cocktail Sauce
- Buffalo Shrimp Basket: Half $80.00 | Full $190.00 - Tossed in buffalo sauce
- Sampler Platter: Half $59.99 | Full $120.00 - Served with Honey Mustard, Ranch, Marinara

### Catering Wings (Serves Half: 8-10, Full: 15-20)
- Traditional Wings: Half $59.99 | Full $134.99
- Breaded Wings: Half $59.99 | Full $134.99
- Boneless Wings: Half $59.99 | Full $134.99
- Chicken Tenders: Half $59.99 | Full $134.99

### Catering Fries (Serves Half: 8-10, Full: 15-20)
- French Fries / Cheese Fries / Old Bay Fries / Steak Fries / Mega Fries / Pizza Fries / Philly's Fries: Half $34.99 - $45.00 | Full $84.99
- Cheese Steak Fries / Chicken Fries / Buffalo Chx Fries: Half $60.00 | Full $100.00 - $110.00
- Curly Fries: Half $45.00 | Full $84.99

### Catering Salads (Serves Half: 8-10, Full: 15-20)
- Garden Salad / Caesar Salad: Half $40.00 | Full $80.00
- Chicken Salad / Buff Grlld Chx / Chx Caesar / Chef / Greek / Greek Grlld Chx / Tuna / Antipasto Salad: Half $49.99 | Full $99.99
- Shrimp Salad: Half $85.00 | Full $200.00
- Salmon Salad: Half $85.00 | Full $190.00
- Steak Salad: Half $59.99 | Full $119.99

### Catering Pasta (Serves Half: 8-10, Full: 15-20)
- CYO Pasta / Penne Primavera / Chicken Marsala / Chicken Parmigiana / Lasagna / Baked Ravioli / Stuffed Shells / Baked Ziti / Spaghetti Meat Sauce: Half $49.95 | Full $89.99
- Seafood Pasta: Half $80.00 | Full $200.00
- Shrimp & Scallop Scampi: Half $85.00 | Full $190.00
- Shrimp Parmigiana: Half $80.00 | Full $160.00
- Lobster Ravioli: Half $80.00 | Full $120.00

### Catering Latin (Serves Half: 8-10, Full: 15-20)
- Tacos / Fajitas: Half $60.00 | Full $140.00
- Burritos: Half $80.00 | Full $160.00
- Papusas / Quesadillas: Half $80.00 - $85.00 | Full $180.00
- Empanadas / Carne Asada: Half $100.00 | Full $200.00
- Pollo Ranchero / Pollo Rostizado: Half $85.00 | Full $200.00
- Nachos: Half $60.00 | Full $90.00
`;

const SYSTEM_PROMPT = `
You are Raggio AI, the official digital assistant for Raggio Gourmet & Pizza in Newark, DE.

FULL REGULAR MENU KNOWLEDGE BASE:
${REGULAR_MENU}

SPECIALS & COUPONS:
${SPECIALS_MENU}

CATERING KNOWLEDGE BASE:
${CATERING_MENU}

STRICT RULES:
1. Respond in 1-2 concise sentences. Never cut off mid-sentence.
2. Confirm clearly that we serve Calzones, Strombolis, Pizzas, Steaks, Salads, Pasta, and Catering.
3. For regular menu items, quote exact prices from the knowledge base above and append the link: [View Menu](https://www.raggiogourmetpizza.com/#menu).
4. For deals, discounts, coupons, or specials inquiries, state exact deals and append the link: [Current Deals](https://www.raggiogourmetpizza.com/#specials).
5. For catering inquiries (trays, group orders, half/full tray pricing), state exact tray prices and append the link: [Catering Options](https://www.raggiogourmetpizza.com/#catering).
6. Always respond in English.
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const apiKey =
            process.env.GEMINI_API_KEY ||
            process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { reply: 'System Error: API Key is not configured.' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash-latest',
            systemInstruction: SYSTEM_PROMPT,
        });

        // Filtering out initial assistant welcome messages to ensure history starts with 'user'
        const validMessages = (messages || []).filter(
            (m: any, idx: number) => !(idx === 0 && (m.role === 'model' || m.sender === 'bot'))
        );

        const history = validMessages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' || m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.content || m.text }],
        }));

        const lastMessageObj = validMessages[validMessages.length - 1];
        const lastMessage = lastMessageObj ? (lastMessageObj.content || lastMessageObj.text) : '';

        const chat = model.startChat({
            history: history,
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 400,
            },
        });

        const result = await chat.sendMessage(lastMessage);
        const text = result.response.text();

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        console.error('AI Error:', error);
        return NextResponse.json(
            { reply: `System Error: ${error.message || 'Unknown connection error.'}` },
            { status: 500 }
        );
    }
}