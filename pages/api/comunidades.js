import { SiteClient } from 'datocms-client';
  
export default async function requestReceiver(req, res){

    if(req.method === 'POST') {
        const TOKEN = '6c31372c51484dfc0dd067f473367c';
        const client = new SiteClient(TOKEN);
    
        //Validar dados antes de cadastrar!
        const registroCriado = await client.items.create({
            itemType: "972867", //modelID criado automaticamente pelo DatoCMS
            ...req.body,
            // title: "Comunidade teste",
            // imageUrl: "https://i.pravatar.cc/300",
            // creatorSlug: "basiliohadnan"
          })

          console.log(registroCriado);
        
        res.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }

    res.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST temos!'
    })
};