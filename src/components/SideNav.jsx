import React, {useState} from 'react'
import {first151Pokemon, getFullPokedexNumber} from "../utils/index.js";

export default function SideNav(props) {

    const {selectedPokemon, setSelectedPokemon} = props

   const [searchValue, setSearchValue] = useState('')

   const filteredPokemon = first151Pokemon.filter((ele,eleIndex) => {
    if ((getFullPokedexNumber(eleIndex)).includes(searchValue)) {
        return true
    }

    if (ele.toLocaleLowerCase().includes(searchValue)) {return true} 
   
    return false
    })
    
    return (
        <nav>
            <div>
                <h1 className={'text-gradient'}>Pokedex</h1>
            </div>
            <input placeholder='E.g. 001 or gengar' value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}}/>

            {filteredPokemon.map((pokemon, pokemonIndex)=>{
                const truePokedexNumber = first151Pokemon.indexOf(pokemon)
                return (
                    <button onClick={()=>{setSelectedPokemon(first151Pokemon.indexOf(pokemon))}} key={pokemonIndex} className={'nav-card ' + (pokemonIndex === selectedPokemon ? 'nav-card-selected' : '')} >
                        <p>{getFullPokedexNumber(first151Pokemon.indexOf(pokemon))}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}
