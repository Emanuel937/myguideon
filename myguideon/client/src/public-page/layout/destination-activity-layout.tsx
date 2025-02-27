import React, { useEffect, useState } from 'react';
import DestinationInfoTemplate from './destination-poup-up-template';
import HOSTNAME_WEB from '../../admin/constants/hostname';

// reorganize this after .....

interface ActivityComponentsInterface {
    categoriesName : string, 
    categoriesIcons: string
}

interface CategoriesActivityCardCompoentsInterface
 {  cardCover:String, 
    activitiesName:String, 
    activiesPrice:String, 
    activiesRating:String, 
    activityTotalRating:String|number
 }



const DestinationActivityLayout = ()=>{

    return <DestinationInfoTemplate 
           Content={ActivitiesContent}
        />

}

const CategoriesActivityComponents:React.FC<ActivityComponentsInterface> =
 ({ categoriesName, categoriesIcons})=>
{
    return ( <p className='categories_sections'>
                <img className='categories_icons'
                    src={`/assets/img/${categoriesIcons}`}
                    alt={" "}
                />
                <span className='categories_name'> {categoriesName}</span>
            </p>);
}


const CategoriesActivityCardCompoents:React.FC<CategoriesActivityCardCompoentsInterface> = ({cardCover, activitiesName, activiesPrice, activiesRating, activityTotalRating="12"})=>{
    return(
        <div className='containerActiviesCard'>
            <div className='card_img'>
                <img 
                  src={`/assets/img/${cardCover}`}
                />
            </div>
            <div className='card_information'>
                <p > 
                    <span className='activity_name'>{activitiesName} </span> 
                    <span className='rating'> 
                    
                     <i className="bi bi-star-fill  star-big" ></i>
                     {activiesRating} ({ activityTotalRating})
                    </span>
                </p>
                <p className='card_information_grey_text'> 
                    Starting at <span> <span className='activity_price'> {activiesPrice} </span> /hour</span>
                </p>
            </div>
        </div>
    )
}
const ActivitiesContent = ()=>{
    const id = 1;
    const [data, setData] = useState([]);


    const fetchData  = async()=>{
        const response  =  fetch(`${HOSTNAME_WEB}/activities/${id}`)
        .then((response)=>{
            if(!response.ok){
                throw('there is an error')
            }
            return response.json();
        }
        ).then((response)=>{
                setData(response);
        })

    }

    useEffect(()=>{
        fetchData();

    }, []);

    
    return (
        <article>
            <section className='section_section_categoires'>
                <CategoriesActivityComponents 
                    categoriesIcons={'nature_categoires.png'}
                    categoriesName={'NATURE & ADVENTURE'}
                />
                 <CategoriesActivityComponents 
                    categoriesIcons={'exploration.png'}
                    categoriesName={'EXPLORATION'}
                />
                 <CategoriesActivityComponents 
                    categoriesIcons={'worship_place.png'}
                    categoriesName={'VISIT WORSHIP PLACES'}
                />
                 <CategoriesActivityComponents 
                    categoriesIcons={'sunbathing.png'}
                    categoriesName={'BEACHES & SUNBATHING'}
                />
                 <CategoriesActivityComponents 
                    categoriesIcons={'sport.png'}
                    categoriesName={'SPORTS'}
                />
                  <CategoriesActivityComponents 
                    categoriesIcons={'sport.png'}
                    categoriesName={'SPORTS'}
                />
                  <CategoriesActivityComponents 
                    categoriesIcons={'sport.png'}
                    categoriesName={'SPORTS'}
                />
            </section>
            <section className='d-flex flex-wrap flex_card_container'>
                <CategoriesActivityCardCompoents
                    activitiesName="Scuba Diving"
                    cardCover={"scuba.png"}
                    activityTotalRating = {20}
                    activiesRating={'5.0'}
                    activiesPrice={"250€"}
                />
                
            </section>
        </article>
    )
}



export default DestinationActivityLayout;