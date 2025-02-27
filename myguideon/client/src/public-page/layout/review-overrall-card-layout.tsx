import {OverrallCard} from '../components/destination_all_component';

const OverrallCardLayout = ()=>
    {
        return (
            <div className='d-flex overrallCardLayout'>
                <OverrallCard 
                    bg='#007BFF'
                    title='Overall Experience'
                    note='7.0/10' colorNote={''}                />
                <OverrallCard
                    title = 'Attractions & Activities'
                    src   ='/assets/img/castle_green.svg'
                    note  ='7.9/10'
                    colorNote = "#6CBF3D"
                    
                 />
                <OverrallCard
                    title="Cost & Accessibility"
                    src="/assets/img/blue_dolar.svg"
                    note="8.0/10"
                    colorNote="#579CE7"
                />
                   <OverrallCard
                    title="Hospitality & Safety"
                    src="/assets/img/security_card.svg"
                    note="6.5/10"
                    colorNote="#6E8DE9"
                />
                   <OverrallCard
                    title="Gastronomy"
                    src="/assets/img/food_card.svg"
                    note="9.5/10"
                    colorNote="#FFC502"
                />
              
            </div>
        );
      
    }


export default OverrallCardLayout;