import React, { useState } from 'react';
import {Basic} from './mokit';
import { Laskutus } from './laskutus';
import { Raportit } from './raportit';
import {Link, NavLink, Routes, Route, BrowserRouter as Router, useNavigate, useLocation, Navigate} from 'react-router-dom'

const RouteAppLuento = (props) => {
    const [user, setUser] = useState(null);

    const loginDone = (loggedUser) => { setUser(loggedUser); }

    return(
        <Router>
            <p>Käyttäjä on {user}</p>
            
            {
                //NavLink on sama kuin Link, NavLink:iin voi  liittää tyylimäärittelyn
            }
            <NavLink to="/">Etusivu</NavLink>
            <Link to="/news">Alueet</Link>
            <Link to="/options">Palvelut</Link>
            <Link to="/basic">Mökit</Link>
            <Link to="/info">Asiakkaat</Link>
            <Link to="/laskutus">Laskutus</Link>
            <Link to="/raportit">Raportit</Link>

            <Routes>
                {
                // MYÖS Tässä versiossa Home-komponentissa ON käytettävissä props:t. Huomaa component-attribuutin sisältö -> komponentin nimi ILMAN <>-merkkejä!
                // HUOM! react router v6:ssa EI ole exact-props:ia!! (vaikka se tässä toimii, ota se pois!!)
                <Route exact path="/" element={<Home />}/>

                }
                {/* 
                React router v6:ssa EI ole render prop:ia (v4:ssa oli)
                <Route path="/news" render={(renderProps) => <News {...renderProps}/>}/> */}
                
                <Route path="/news" element={<News />} />
                <Route path="/options" element=
                {   user ?
                    <Options /> : <LoginComponent onLogin={(user) => loginDone(user)}/>
                }/>
                <Route path="/basic" element={<Basic />}/> 
                <Route path="/info" element={<Info />}/> 
                <Route path="/laskutus" element={<Laskutus />}/> 
                <Route path="/raportit" element={<Raportit />}/> 


                <Route path="*" 
                    element={<Navigate to="/" />} />

{/*
                react router v6:ssa EI ole Redirect:ia (v4:ssa oli)
                <Route path="/info">
                {   user ?
                    <Info /> : <Redirect to="/" />
                }
                </Route>
            */}
            </Routes>
        </Router>
    );
}

const LoginComponent = (props) => {
    
    // HUOM! useHistory TOIMII VAIN funktio komponentissa
    // useHistory, useLocation (myös pari muuta Hook:ia) lisättiin React Router:iin versiosta 5 alkaen, helpottaa ohjelmallista navigointia kun props:ia ei enää tarvita

    // useHistory EI ole enää käytössä v6:ssa (v4:ssa oli)
    //let h = useHistory();
    let navigate = useNavigate();
    console.log("Login:", props);

    const onClick = (event) =>
    {
        if ( props.onLogin != null)
        {
            props.onLogin('KTKOIJU');
            navigate("/news");
        }
    }

    return (
        <div>
            <p>Kirjaudu sisään</p>
            <button onClick={(e) => onClick(e)}>Kirjaudu</button>
        </div>
    );
}

function Home(props)
{
    let location = useLocation();

    // useLocation Hook:n avulla päästään käsiksi location-olioon
    console.log("HOME l:", location);

    return <div><p>This is Home (reitti oli {location.pathname}) </p></div>
}

const News = props => {

    // react:n Hook
    let location = useLocation();

    console.log("NEWS:", location);

    return <div><p>This is news (reitti oli {location.pathname})</p></div>
}

const Options = () => {
    let location = useLocation();
    console.log("OPTIONS:", location);

    return(
        <div><h3>Tämä on Options-komponentti</h3></div>
    )
}

// HUOM! Jos on kaarisulut, EI tule return-lausetta
const Info = () => (
    <div><h4>Infoa sovelluksesta</h4></div>
)



export default RouteAppLuento;