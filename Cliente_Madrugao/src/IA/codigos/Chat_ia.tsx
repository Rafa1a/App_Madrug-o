import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,} from "@google/generative-ai"; 

    
const apiKey = 'apiKey';
const genAI = new GoogleGenerativeAI(apiKey); 

async function IaChats(input: string,hitorys: { role: 'user' | 'model'; parts: { text: string }[] }[],instruction:string) {
    const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: instruction,
    }); 
   
    const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
    };

    const safetySettings = [
    {category : HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,threshold: HarmBlockThreshold.BLOCK_NONE},
    {category: HarmCategory.HARM_CATEGORY_HARASSMENT,threshold: HarmBlockThreshold.BLOCK_NONE},
    {category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,threshold: HarmBlockThreshold.BLOCK_NONE},
    {category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,threshold: HarmBlockThreshold.BLOCK_NONE},
    //    {category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,threshold: HarmBlockThreshold.BLOCK_NONE}7*8
    ]

    // console.log('esta aki1');
    // console.log('input:',input);
    console.log(JSON.stringify(hitorys,null,0))
    const chatSession = model.startChat({
        generationConfig,
        safetySettings: safetySettings,
    // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: hitorys,
    });
    // console.log('esta aki vamo q vamo ');
    try {
        const result = await chatSession.sendMessage(input);
        return result.response.text()
        
    } catch (error) {
        console.log(error);
    }
    // console.log(result.response.text());
}
export default IaChats