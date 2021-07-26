import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(property){
  return (
    <Box as="aside">
    <img src={`https://github.com/${property.gitHubUser}.png`} style={{borderRadius: '8px'}}/>
    <hr/>
    <p>
    <a className="boxLink" href={`https://github.com/${property.gitHubUser}`}>
      @{property.gitHubUser}
    </a>
    </p>
    <hr/>
    <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsBox(property) {
  return (
  <ProfileRelationsBoxWrapper>
  <h2 className="smallTitle">
    {property.title} ({property.items.length})
    </h2>
  <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`/users/${itemAtual.title}`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })} */}
      </ul>
  </ProfileRelationsBoxWrapper>)
}

export default function Home() {
  const gitHubUser = 'basiliohadnan';
  const [comunidades, setComunidades] = React.useState([]);
  // const comunidades = comunidades[0];
  // const alteradorDeComunidades = comunidades[1];
  // console.log('Nosso teste:', comunidades[0]);
  const pessoasFavoritas = [
    'DouglasAugustoJunior',
    'GuilhermeM06',
    'carlosheadst',
    'juunegreiros',
    'peas',
    'omariosouto']
    const [seguidores, setSeguidores] = React.useState([]);

    //0. pegar array de dados do github
  React.useEffect(function (){
    fetch('https://api.github.com/users/basiliohadnan/followers')
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function (respostaCompleta) {
      setSeguidores(respostaCompleta);
    })

  //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '1132d2fe1cc2309a8372c960f10b99',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "query": `query {
        allCommunities{
          title
          id
          imageUrl
          creatorSlug
        }
      }` })
     })
     .then((response) => response.json())
     .then((respostaCompleta) => {
       const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
       console.log(comunidadesVindasDoDato)
       setComunidades(comunidadesVindasDoDato)
     })
  }, [])




  // console.log('Seguidores antes do return: ' + seguidores);
    //1. criar um box que vai ter um map baseado nos itens do array
//que pegamos do github
  
  return (
    <>
      <AlurakutMenu githubUser={gitHubUser}/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <ProfileSideBar gitHubUser={gitHubUser}/>
        </div>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bom dia, {`${gitHubUser}!`}
          </h1>
          <OrkutNostalgicIconSet/>
        </Box>
        <Box>
          <h2 className="subTitle">O que você deseja fazer?</h2>       
          <form onSubmit={function handleCriaComunidade(e){
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);

            console.log('Campo: ', dadosDoForm.get('title'));
            console.log('Campo: ', dadosDoForm.get('image'));

            const comunidade = {
              title: dadosDoForm.get('title'),
              imageUrl: dadosDoForm.get('image'),
              creatorSlug: gitHubUser,
            }

            fetch('/api/comunidades', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(comunidade)
            })
            .then(async (response) => {
              const dados = await response.json();
              console.log(dados.registroCriado);
              const comunidade = dados.registroCriado;
              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);
            })
          }}>
          <div>
            <input 
              placeholder="Qual vai ser o nome da sua comunidade?" 
              name="title"
              aria-label="Qual vai ser o nome da sua comunidade?"
              type="text"
              />
            </div>       
            <div>
            <input 
              placeholder="Coloque uma URL para usarmos de capa" 
              name="image"
              aria-label="Coloque uma URL para usarmos de capa"
              />
            </div>

            <button>
              Criar comunidade
            </button>
          </form>
        </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBox title="Seguidores" items={seguidores}/>
        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            Comunidades ({comunidades.length})
          </h2>
        <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Rede ({pessoasFavoritas.length})
          </h2>

          <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}