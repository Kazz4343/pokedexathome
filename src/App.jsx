import React, {useState} from 'react'
import Header from './components/Header'
import SideNav from './components/SideNav'
import PokeCard from './components/PokeCard'

export default function App() {
    const [selectedPokemon, setSelectedPokemon] = useState(0)

    return (
        <>
            <Header />
            <SideNav selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />
            <PokeCard selectedPokemon={selectedPokemon}/>
        </>
  )
}
