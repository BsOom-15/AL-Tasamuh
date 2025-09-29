import React from 'react';
import './ExhibitionsSection.css'
import exhebitions from '../../utils/exhibitions'
import { Link } from 'react-router-dom';
const Exhibitions = () => {

    const textLimit = (text, wordLimit) => {
        const words = text.split(' ');
        if(words.length <= wordLimit) {
            return text;
        }

        return words.slice(0, wordLimit).join(' ') + '...';
    }
    
    return (
        <div className='exhibitions-container'>
            {exhebitions.map((item, index) => (
                <div className="exibitions-content" key={index}>
                    <div className="title-exhibitions">
                        <Link to={`/exhibitions/${item.id}`}>
                        <div className="title-name">
                        <h1>{item.name}</h1>
                        </div>
                        <div className="name-artists">
                        <h2>{item.artist}</h2>
                        </div>
                        <div className="artist-date">
                        <h2>{item.date}</h2>
                        </div>
                            <div className="artist-overflow">
                                <p>{textLimit(item.overview, 39)}</p>
                            </div>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Exhibitions