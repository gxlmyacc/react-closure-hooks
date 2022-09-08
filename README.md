# react-closure-hooks

reexport react hooks, and add `useEvent`. They are useful for solving the closure problem in react hooks.

## install

```bash
npm install --save react-closure-hooks
```
or
```bash
yarn add react-closure-hooks
```

## usage

```js
// Test
import React from 'react';
import { Search } from 'antd';
import { useState, useEvent } from 'react-closure-hooks';
import API from '@/request';

const Test = () => {
  const [searchKey, setSearchKey] = useState('');
  const [result, setResult] = useState('');

  const doQuery = useEvent(async () => {
    const result = await API.query({
      searchKey
    });
    setResult(result);
  });

  const doSearch = useEvent(async (e) => {
    await setSearchKey(e.target.value);
    doQuery();
  });

  return (
    <div>
      <Search 
        value={searchKey} 
        onSearch={doSearch}
      ><br />
      <div>{result}</div>
    </div>
  );
};

export default Test;
```

or use `useStateWithPromise`

```js
// Test
import React, { useState } from 'react';
import { Search } from 'antd';
import { useStateWithPromise, useEvent } from 'react-closure-hooks';
import API from '@/request';

const Test = () => {
  const [searchKey, setSearchKey] = useStateWithPromise('');
  const [result, setResult] = useState('');

  const doQuery = useEvent(async () => {
    const result = await API.query({
      searchKey
    });
    setResult(result);
  });

  const doSearch = useEvent(async (e) => {
    await setSearchKey(e.target.value);
    doQuery();
  });

  return (
    <div>
      <Search 
        value={searchKey} 
        onSearch={doSearch}
      ><br />
      <div>{result}</div>
    </div>
  );
};

export default Test;
```

## License

[MIT](./LICENSE)

