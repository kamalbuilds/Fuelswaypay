import React from 'react';
import { Carousel } from 'antd';

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '180px',
    color: 'green',
    lineHeight: '160px',
    textAlign: 'center',
  };

export const FeatureImageSlides = ({ imageUrls }: { imageUrls: string[] }) => {
    return (
        <Carousel autoplay>
            {
                imageUrls.map((image, index) => {
                    return <div key={`wrapper-${index}`}>
                        <div key={`image-wrapper-${index}`} style={contentStyle}>
                            <img width={"100%"} src={image} />
                        </div>
                    </div>
                })
            }
        </Carousel>
    );
};