require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const twilioClient = require("twilio");

const client = new twilioClient();
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;


// This is a single page application and it's all rendered in public/index.html
app.use(express.static("public"));
// Parse the body of requests automatically
app.use(bodyParser.json());

app.get("/api/compliments", async (req, res) => {
  
  const compliments = [];
  const sentMessages = await client.messages.list({from: twilioNumber});
  //console.log(sentMessages);
  /* const aux = sentMessages.map(message => message.body);
  for(var i = 0; i < aux.length; i++){
    var aux2 = aux[i].split('account -')[1];
    compliments.push(aux2);
  }
  res.json(compliments); */
  res.json(sentMessages)
});

app.post("/api/compliments", async (req, res) => {
  const to = req.body.to;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const body = `Mensagem de ${req.body.sender}:  \n ${req.body.receiver} é ${req.body.compliment}.`;
  //See more compliments at ${req.headers.referer}
  try{
    await client.messages.create({to,from,body});
    res.json({ success: true });
  } catch(err){
    res.status(err.status).json({success: false, message: err.message})
  }
  
});

app.delete("/api/compliments", async (req, res) => {
  const id = req.body.id;
  try{
    await client.messages(id).remove();
    res.json({ success: true });
  } catch(err){
    res.status(err.status).json({success: false, message: err.message})
  }
  
});

app.listen(port, () => console.log(`Prototype is listening on port ${port}!`));
