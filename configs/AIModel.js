const{
  GoogleGenerativeAI,
  harmCategory,
  HarmBlockthreshold,
}=require("@google/generative-ai");

const apikey=process.env.GEMINI_API_KEY;
const genAI=new GoogleGenerativeAI(apikey);

const model=genAI.getGenerativeModel({
  model:"gemini-1.5-flash",
});

const generationConfig={
  temperature:1,
  topP:0.95,
  topK:40,
  maxOutputtokens:8192,
  responsemimeType:"text/plain",
};


 export const chatSession=model.startChat({
    generationConfig,
    history:[

    ],
  });

  //const result=await chatSession.sendMessage("INSERT_INPUT_HERE");
  //console.log(result.response.text());


