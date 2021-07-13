import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(property){
  return (
    <Box>
    <img src={`https://github.com/${property.gitHubUser}.png`} style={{borderRadius: '8px'}}/>
    </Box>
  )
}
export default function Home() {
  const gitHubUser = 'basiliohadnan';
  const pessoasFavoritas = [
    'DouglasAugustoJunior',
    'GuilhermeM06',
    'carlosheadst',
    'juunegreiros',
    'peas',
    'omariosouto']
  
  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <ProfileSideBar gitHubUser={gitHubUser}/>
        </div>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Olá, {`${gitHubUser}!`}
          </h1>

          <OrkutNostalgicIconSet/>
          
        </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
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