import React, {cache, useEffect, useState} from 'react'
import {getFullPokedexNumber, getPokedexNumber} from "../utils/index.js";
import TypeCard from "./TypeCard.jsx";
import Modal from './Modal.jsx';

export default function PokeCard(props) {

  const {selectedPokemon} = props
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [skill, setSkill] = useState(null)
  const [loadingSkill, setLoadingSkill] = useState(false)
   
  const {name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter(val => {
    if (!sprites[val]) { return false }
    if (['versions', 'other'].includes(val)) { return false }
    return true
  })

  async function fetchMoveData (move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) {return}
    
    let c = {}
    if (localStorage.getItem('pokemon-move')) {
      c = JSON.parse(localStorage.getItem('pokemon-move'))
    }

    if (move in c){
      setSkill(c[move])
      console.log('Found move in Cache')
      return
    }

    try {
      setLoadingSkill(true)
      const res = await fetch (moveUrl)
      const moveData = await res.json() 
      console.log('Fetch move from API', moveData)
      const description = moveData?.flavor_text_entries.filter(val => {
        return val.version_group.name = 'firered-leafgreen'
      })[0]?.flavor_text
      
      const skillData = {
        name:move,
        description
      }
      setSkill(skillData)
      c[move] = skillData
      localStorage.setItem('pokemon-move', JSON.stringify(c))

    } catch (err) {
      console.log(err)
    } finally {
      setLoadingSkill(false)
    }

  }

  
  useEffect(()=>{
    // try to fetch API and then save it in the cache
    if (loading || !localStorage) {return}


    let cache = {};
    if (localStorage.getItem('pokedex')) {
      cache  = JSON.parse(localStorage.getItem('pokedex'));
    }

    if (selectedPokemon in  cache) {
      setData(cache[selectedPokemon])
      console.log('Found pokemon in Cache')
      return
    }

    async function fetchData() {
      setLoading(true)
      try {
      // const baseUrl = `https://pokeapi.co/api/v2/`
       // const suffix = `pokemon/` + `pikachu`;
        const final = `https://pokeapi.co/api/v2/pokemon/${getPokedexNumber(selectedPokemon)}`;
        const response = await fetch(final);
        const pokemonData = await response.json();
        setData(pokemonData);
        console.log('Fetched pokemon data')
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem('pokedex', JSON.stringify(cache));
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false)
      }
    }

    fetchData()

  },[selectedPokemon])

  if (loading ) {
    return (
        <div>
          <h4>Loading...</h4>
        </div>
    )
  }

  return (
    <div className='poke-card'>
      {skill &&(<Modal handleCloseModal={()=>{setSkill(null)}}>
        <div>
          <h6>Name</h6>
          <h2 className='skill-name'>{skill.name.replaceAll('-',' ')}</h2>
        </div>
        <div>
          <h6>Description</h6>
          <p>{skill.description}</p>
        </div>
      </Modal>
    )}
      <div>

        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className={'type-container'}>
        {types && types.map((typeObj, typeIndex)=>{
          return (
              <TypeCard type={typeObj?.type?.name} key={typeIndex} />
          )
        })}
      </div>
        <div className={'img-container'}>
          {imgList.map((spriteUrl,spriteIndex)=>{
            const imgUrl = sprites[spriteUrl]

            return (
                <img key={spriteIndex} src={imgUrl} />
            )
          })}
        </div>
      <h3>Stats</h3>
      <div className={'stats-card'}>
        {stats && stats.map((statObj, statIndex)=>{
          const {stat, base_stat } = statObj;
          return (
              <div key={statIndex}>
                <p>{stat?.name.replaceAll('-', ' ')}</p>
                <h4>{base_stat}</h4>
              </div>
          )
        })}
      </div>
      <h3>Moves</h3>
      <div className={'pokemon-move-grid'}>
        {moves && moves.map((moveObj, moveIndex)=>{
          return (
              <button onClick={()=>{fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)}} key={moveIndex} className={'button-card pokemon-move'}>
                <p>{moveObj?.move?.name?.replaceAll('-',' ')}</p>
              </button>
          )
        })}
      </div>
    </div>
  )
}
