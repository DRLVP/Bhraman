import { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';
import { generateMetadata as getMetadata } from './metadata';

export const generateMetadata = (): Promise<Metadata> => {
  return getMetadata();
};

export default function Home() {
  return <HomeClient />;
}
