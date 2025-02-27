import React,{useEffect, useState}                    from 'react';
import HeaderLayout             from '../../layout/HeaderLayout';
import DestinationPreviewGalery from '../../layout/destinationPreviewGalery';
import MixDestinationLayout     from '../../layout/mixedDestinationLayout';
import { useParams } from "react-router-dom";
import HOSTNAME_WEB from '../../../admin/constants/hostname';

interface DestinationData 
{
  imageCover? : string;
  basicInfo?  :{},
  gallery?    : []
}
// the first destination page 
const DestinationOverviewPage = ()=>{
    let destinationImage:string[] = [ 

    ];
  
    const [photoPath, setPhotoPath] = useState(destinationImage[0]);
    
    if (destinationImage.length > 9) {
      destinationImage = destinationImage.slice(0, 9); // Correction : les 9 premières images
    }
  
    const handleImagePath = (imageName: string) => {
      setPhotoPath(imageName);
    };
  
    const { id } = useParams();
    const [data, setData] = useState<DestinationData>({});
  
    const fetchData = async () => {
      try {
        const response = await fetch(`${HOSTNAME_WEB}/destination/details/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        const responseData = await response.json();
  
        var data = responseData;
        var basicInfo = JSON.parse(data.basic_info);
        var gallery   = JSON.parse(data.gallery);
  
        setData({
          imageCover:data.imageCover,
          basicInfo:{...basicInfo},
          gallery:gallery
        });
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
    
    var jsonDataBasicInfo:any =  data.basicInfo;

    return (<div>
                <HeaderLayout/>
                <div  
                    className='destinations'>
                    <DestinationPreviewGalery 
                       data={data}
                    />
                  { <MixDestinationLayout data={data.basicInfo}/>}
                </div>
            </div>)
}


export default DestinationOverviewPage;