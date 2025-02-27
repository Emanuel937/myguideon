import React from 'react';
import MapComponent from '../../components/map_component';
import HeaderLayout from '../../layout/HeaderLayout';
import '../../assets/styles/css/destination.css'
import DestinationMap from '../../components/destination_map';
import { useNavigate } from 'react-router-dom';

const SearchOnMap = ()=>{
    const navigate = useNavigate();
    return (<div>
                <HeaderLayout/>
                
                <section className='map_section'>
                    <p className='map_back' onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
                         <img src={'/assets/img/map_back.svg'}/>  Back to  Classic GuideMap
                    </p>
                    <p className='explore_mode' >
                        <img src={'/assets/img/world.svg'}/>  Exploration mode
                    </p>
                    <p className='bottom_map_activity_menu'>
                        <img src={'/assets/img/activity.svg'}/>
                        Activities
                    </p>
                    <article className='map_article'>
                       <DestinationMap/>
                    </article>
                </section>
             </div>)
}

export default SearchOnMap;