import axios from 'axios';

import { api } from '../boot/axios';

import { IRestaurant } from '@models/IRestaurant';
import { IAddress } from '@models/IAddress';

interface ViaCepResponse {
  erro?: boolean;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface ICheckURL {
  isAvailable: boolean;
}

export async function getUserRestaurant(): Promise<IRestaurant> {
  const response = await api.get<IRestaurant>('restaurants/me');

  return response.data;
}

export async function checkRestaurantURL(url: string): Promise<ICheckURL> {
  const response = await api.post<ICheckURL>('restaurants/check-url', { url });

  return response.data;
}

export async function updateRestaurant(
  restaurant: Partial<IRestaurant>,
): Promise<IRestaurant> {
  const response = await api.patch<IRestaurant>('restaurants', restaurant);

  return response.data;
}

export async function getAddressByZipCode(zipCode: string): Promise<IAddress> {
  const url = `https://viacep.com.br/ws/${zipCode}/json/`;
  const response = await axios.get<ViaCepResponse>(url);

  const { data } = response;

  if (data.erro) {
    throw new Error('Invalid zip code');
  }

  return {
    zipCode: data.cep,
    state: data.uf,
    city: data.localidade,
    neighborhood: data.bairro,
    streetName: data.logradouro,
  };
}
