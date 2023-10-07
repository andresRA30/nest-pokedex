import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonService } from '../pokemon/pokemon.service';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  // constructor(private readonly pokemonService:PokemonService){

  // } mi forma

  constructor(@InjectModel(Pokemon.name)
  private readonly pokemonModel:Model<Pokemon>,
  private readonly http: AxiosAdapter
  ){

  }//La forma de fernando
  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const  data  = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    const pokemonToInsert:{name:string, no:number}[] = []
    
    data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2];
        const result:CreatePokemonDto = {
          name,
          no
        }
        // await this.pokemonModel.create(result)//forma de fernando
      // this.pokemonService.create(result); mi forma
      pokemonToInsert.push({name,no});
      });
      this.pokemonModel.insertMany(pokemonToInsert);


    // const insertPromisesArray = []
    //  data.results.forEach(({ name, url }) => {
    //   const segments = url.split('/');
    //   const no: number = +segments[segments.length - 2];
    //   const result:CreatePokemonDto = {
    //     name,
    //     no
    //   }
    //   // await this.pokemonModel.create(result)//forma de fernando
    // // this.pokemonService.create(result); mi forma
    // insertPromisesArray.push(this.pokemonModel.create({name,no}));
    // });
    // await Promise.all(insertPromisesArray);

    return 'Seed Executed';
  }
}
//Tiempos de ejecucion
//forma de await en foreach: 839ms
//forma de arreglos de awaits: 2.24s
//insetMany con mongo: 535ms