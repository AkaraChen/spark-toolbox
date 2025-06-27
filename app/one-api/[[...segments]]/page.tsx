'use client'

import * as React from 'react';
import { Crud } from '@toolpad/core';
import { OneApiProvider, oneApiProviderEntity } from '@/modules/one-api/entity';

export default function OneApiPage() {
  return (    
    <Crud<OneApiProvider>
      dataSource={oneApiProviderEntity.dataSource}
      cache={oneApiProviderEntity.cache}
      rootPath="/one-api"
    />
  );
}
