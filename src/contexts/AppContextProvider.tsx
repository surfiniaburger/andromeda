import React from 'react';

interface GenericComponentProps {
  children: React.ReactElement;
}


interface Props {
  components: Array<React.ComponentType<GenericComponentProps>>;
  children: React.ReactElement;
}
export default function AppContextProviders({ 
  components = [], 
  children 
}: Props) {
  return (
    <>
      {components.reduceRight((acc, Comp) => {
        return <Comp>{acc}</Comp>;
      }, children)}
    </>
  );
}