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
  const [comunidades, setComunidades] = React.useState([{
    id: new Date().toISOString(),
    title: 'Eu odeio acordar cedo',
    image: 'https://pbs.twimg.com/profile_images/143696361/avatar_400x400.jpg'
  }]);
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
              id: new Date().toISOString(),
              title: dadosDoForm.get('title'),
              image: dadosDoForm.get('image')
            }

            const comunidadesAtualizadas = [...comunidades, comunidade];
            setComunidades(comunidadesAtualizadas);
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
                    <a href={`/users/${itemAtual.title}`}>
                      <img src={itemAtual.image} />
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