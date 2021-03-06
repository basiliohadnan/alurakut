import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

function ProfileRelationsBoxComunidade(props) {
  return (
    <ProfileRelationsBoxWrapper>
    <h2 className="smallTitle">
      {props.title} ({props.items.length})
      </h2>
      <ul>
          {props.items.map((itemAtual) => {
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
  )
}

function ProfileRelationsBoxGitHub(props) {
  return (
  <ProfileRelationsBoxWrapper>
  <h2 className="smallTitle">
    {props.title} ({props.items.length})
    </h2>
    <ul>
        {props.items.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={itemAtual.html_url}>
                <img src={itemAtual.avatar_url}/>
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
    </ul>
  </ProfileRelationsBoxWrapper>)
}


export default function Home(props) {
  const githubUser = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);
  const [followers, setFollowers] = React.useState([]);
  const [following, setFollowing] = React.useState([]);

  

function ProfileSideBar(prop){
  return (
    <Box as="aside">
    <img src={`https://github.com/${prop.githubUser}.png`} style={{borderRadius: '8px'}}/>
    <hr/>
    <p>
    <a className="boxLink" href={`https://github.com/${prop.githubUser}`}>
      @{prop.githubUser}
    </a>
    </p>
    <hr/>
    <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

    //0. pegar array de dados do github
  React.useEffect(function (){
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function (respostaCompleta) {
      // console.log('Dados do GitHub: ', respostaCompleta);
      setFollowers(respostaCompleta);
    })

    fetch(`https://api.github.com/users/${githubUser}/following`)
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function (respostaCompleta) {
      setFollowing(respostaCompleta);
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
       setComunidades(comunidadesVindasDoDato)
     })
  }, [])

  // console.log('Followers antes do return: ' + followers);
    //1. criar um box que vai ter um map baseado nos itens do array
//que pegamos do github
  
  return (
    <>
      <AlurakutMenu githubUser={githubUser}/>
      <MainGrid>
      {/* ??rea de perfil */}
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <ProfileSideBar githubUser={githubUser}/>
        </div>
      {/* ??rea de boas vindas */}
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bom dia, {`${githubUser}!`}
          </h1>
          <OrkutNostalgicIconSet/>
        </Box>
        <Box>
          <h2 className="subTitle">O que voc?? deseja fazer?</h2>       
          <form onSubmit={function handleCriaComunidade(e){
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);

            console.log('T??tulo: ', dadosDoForm.get('title'));
            console.log('Imagem: ', dadosDoForm.get('image'));

            const comunidade = {
              title: dadosDoForm.get('title'),
              imageUrl: dadosDoForm.get('image'),
              creatorSlug: githubUser,
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
              console.log("Comunidade criada: ", dados.registroCriado);
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
        {/* ??rea de rela????es */}
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBoxComunidade title="Comunidades" items={comunidades}/>
        <ProfileRelationsBoxGitHub title="Seguimores" items={followers}/>
        <ProfileRelationsBoxGitHub title="Admirades" items={following}/>
        </div>
      </MainGrid>
    </>
  )

}
export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((resposta) => resposta.json())

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}
 