import React from 'react';
import DestinationInfoTemplate from './destination-poup-up-template';
import {UserReviewPhoto, OnlyReviewStar, ReviewLocation, ProgressBar , ReviewStarAndRating} from '../components/destination_all_component';
import OverrallCardLayout from './review-overrall-card-layout';

const ReviewContainer = ()=>{
    return <Container/>
}

const Container = ()=>{
    return (
        <div className='modal_content_main'>
        <OverrallCardLayout/>
        <section className='row review_card'>
            <section className='row col-md-7'>
                <article className='col-md-6'>
                    <h4 className=' review-h4'> User Reviews</h4>
                </article>
                <article className='col-md-3'>
                    <p className=' filter'> 
                        <img src="/assets/img/filter.svg"/>

                            Filter Order 

                        <img src='/assets/img/down.svg'/>
                    </p>
                </article>
                <article className='col-md-3 '>
                    <p className='filter'>
                        Last 12 Month
                        <img src='/assets/img/down.svg'/>
                    </p>
                </article>
            </section>
            <section className='col-md-5'>
                <h4 className='review-h4'> Overall Ratings</h4>
            </section>
            {/** second row */}
            <section className='row'>
                <div className='col-md-7 details_container_container'>
                    <div className=' row details_container'>
                        <section className='col-md-4'> 
                            <h5 className='review-h5'>Username</h5>
                        </section>
                        <section className='col-md-2'>
                            <h5 className='review-h5'>Location</h5>
                        </section>
                        <section className='col-md-6'>
                            <h5 className='review-h5'>Review</h5>
                        </section>
                    </div>
                </div>
                <div className='col-md-5 main-start'>
                  <OnlyReviewStar rating={9} ratingTotal={200}/>
                </div>
            </section>
            <section className='row'>
                <div className='col-md-7 row '>
                    <section className='col-md-4'> 
                        <UserReviewPhoto/>
                        <UserReviewPhoto/>
                        <UserReviewPhoto/>
                        <UserReviewPhoto/>
                    </section>
                    <section className='col-md-2'>
                        <ReviewLocation/>
                        <ReviewLocation/>
                        <ReviewLocation/>
                        <ReviewLocation/>
                    </section>
                    <section className='col-md-6'>
                        <ReviewStarAndRating rating={4.5}/>
                        <ReviewStarAndRating rating={6}/>
                        <ReviewStarAndRating rating={9}/>
                        <ReviewStarAndRating rating={4.5}/>
                    </section>
                </div>
                <div className='col-md-5'>
                    <ProgressBar
                        statQTY  ={10}
                        progres_per_cent= {90}
                    
                    />
                     <ProgressBar
                        statQTY  ={9}
                        progres_per_cent= {50}
                    
                    />
                     <ProgressBar
                        statQTY  ={8}
                        progres_per_cent= {10}
                    
                    />
                     <ProgressBar
                        statQTY  ={7}
                        progres_per_cent= {30}
                    
                    />
                     <ProgressBar
                        statQTY  ={6}
                        progres_per_cent= {30}
                    
                    />
                     <ProgressBar
                        statQTY  ={5}
                        progres_per_cent= {80}
                    
                    />
                     <ProgressBar
                        statQTY  ={4}
                        progres_per_cent= {70}
                    
                    />
                     <ProgressBar
                        statQTY  ={3}
                        progres_per_cent= {40}
                    
                    />
                     <ProgressBar
                        statQTY  ={2}
                        progres_per_cent= {30}
                    
                    />
                       <ProgressBar
                        statQTY  ={1}
                        progres_per_cent= {2}
                    />
                </div>
            </section>
        </section>
    </div>
    );
}

const ReviewTemplate = ()=>{
    return <DestinationInfoTemplate
                Content={ReviewContainer}
    />
}


export default ReviewTemplate;