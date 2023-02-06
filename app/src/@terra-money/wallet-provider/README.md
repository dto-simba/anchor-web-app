# Terra Wallet Provider

Library to make React dApps easier using Terra Station Extension or Terra Station Mobile.

# Quick Start

Use templates to get your projects started quickly

### Code Sandbox

If you want to test features quickly, you can simply run them on CodeSandbox without having to download Templates.

- [Wallet Provider + Create-React-App](https://githubbox.com/terra-money/wallet-provider/tree/main/templates/create-react-app)
- [Wallet Provider + Next.js](https://githubbox.com/terra-money/wallet-provider/tree/main/templates/next)
- [Wallet Provider + Vite.js](https://githubbox.com/terra-money/wallet-provider/tree/main/templates/vite)
- [Wallet Controller + Lit](https://githubbox.com/terra-money/wallet-provider/tree/main/templates/lit)
- [Wallet Controller + Vue.js](https://githubbox.com/terra-money/wallet-provider/tree/main/templates/vue)
- [Wallet Controller + Svelte](https://githubbox.com/terra-money/wallet-provider/tree/main/templates/svelte)

And if you need to start your project from local computer, use the templates below. 👇

### Create React App

```sh
npx terra-templates get wallet-provider:create-react-app your-app-name
cd your-app-name
yarn install
yarn start
```

<https://github.com/terra-money/wallet-provider/tree/main/templates/create-react-app>

### Next.js

```sh
npx terra-templates get wallet-provider:next your-app-name
cd your-app-name
yarn install
yarn run dev
```

<https://github.com/terra-money/wallet-provider/tree/main/templates/next>

### Other templates

- [Wallet Provider + Vite.js](https://github.com/terra-money/wallet-provider/tree/main/templates/vite)
- [Wallet Controller + Lit](https://github.com/terra-money/wallet-provider/tree/main/templates/lit)
- [Wallet Controller + Vue.js](https://github.com/terra-money/wallet-provider/tree/main/templates/vue)
- [Wallet Controller + Svelte](https://github.com/terra-money/wallet-provider/tree/main/templates/svelte)

### Community templates (experimental)

You can find more templates in <https://templates.terra.money>. (This is the beginning stage, so it may not be enough yet)

If you make a different type of template, you can register [here](https://github.com/terra-money/templates).

# Basic Usage

First, please add `<meta name="terra-wallet" />` on your html page.

Since then, browser extensions (e.g. Terra Station chrome extension) will not attempt to connect in a Web app where this `<meta name="terra-wallet">` tag is not found.

```html
<html lang="en">
  <head>
    <meta name="terra-wallet" />
  </head>
</html>
```

If you have used `react-router-dom`'s `<BrowserRouter>`, `useLocation()`, you can easily understand it.

```jsx
import {
  NetworkInfo,
  WalletProvider,
  WalletStatus,
  getChainOptions,
} from '@terra-money/wallet-provider';
import React from 'react';
import ReactDOM from 'react-dom';

// getChainOptions(): Promise<{ defaultNetwork, walletConnectChainIds }>
getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <YOUR_APP />
    </WalletProvider>,
    document.getElementById('root'),
  );
});
```

First, you need to wrap your React App with the `<WalletProvider>` component.

```jsx
import { useWallet } from '@terra-money/wallet-provider';
import React from 'react';

function Component() {
  const { status, network, wallets } = useWallet();

  return (
    <div>
      <section>
        <pre>
          {JSON.stringify(
            {
              status,
              network,
              wallets,
            },
            null,
            2,
          )}
        </pre>
      </section>
    </div>
  );
}
```

Afterwards, you can use React Hooks such as `useWallet()`, `useConnectedWallet()` and `useLCDClient()` anywhere in your app.

# API

<details>

<summary><code>&lt;WalletProvider&gt;</code></summary>

```jsx
import {
  WalletProvider,
  NetworkInfo,
  ReadonlyWalletSession,
} from '@terra-money/wallet-provider';

// network information
const mainnet: NetworkInfo = {
  name: 'mainnet',
  chainID: 'columbus-5',
  lcd: 'https://lcd.terra.dev',
};

const testnet: NetworkInfo = {
  name: 'testnet',
  chainID: 'bombay-12',
  lcd: 'https://bombay-lcd.terra.dev',
};

// WalletConnect separates chainId by number.
// Currently TerraStation Mobile uses 0 as Testnet, 1 as Mainnet.
const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: testnet,
  1: mainnet,
};

// ⚠️ If there is no special reason, use `getChainOptions()` instead of `walletConnectChainIds` above.

// Optional
// If you need to modify the modal, such as changing the design, you can put it in,
// and if you don't put the value in, there is a default modal.
async function createReadonlyWalletSession(): Promise<ReadonlyWalletSession> {
  const terraAddress = prompt('YOUR TERRA ADDRESS');
  return {
    network: mainnet,
    terraAddress,
  };
}

// Optional
// WalletConnect Client option.
const connectorOpts: IWalletConnectOptions | undefined = undefined;
const pushServerOpts: IPushServerOptions | undefined = undefined;

// Optional
// Time to wait for the Chrome Extension window.isTerraExtensionAvailable.
// If not entered, wait for default 1000 * 3 miliseconds.
// If you reduce excessively, Session recovery of Chrome Extension may fail.
const waitingChromeExtensionInstallCheck: number | undefined = undefined;

ReactDOM.render(
  <WalletProvider
    defaultNetwork={mainnet}
    walletConnectChainIds={walletConnectChainIds}
    createReadonlyWalletSession={createReadonlyWalletSession}
    connectorOpts={connectorOpts}
    pushServerOpts={pushServerOpts}
    waitingChromeExtensionInstallCheck={waitingChromeExtensionInstallCheck}
  >
    <YOUR_APP />
  </WalletProvider>,
  document.getElementById('root'),
);
```

</details>

<details>

<summary><code>useWallet()</code></summary>

This is a React Hook that can receive all the information. (Other hooks are functions for the convenience of Wrapping
this `useWallet()`)

<!-- source packages/src/@terra-money/use-wallet/useWallet.ts --pick "Wallet" -->

<!-- /source -->

</details>

<details>

<summary><code>useConnectedWallet()</code></summary>

```jsx
import { useConnectedWallet } from '@terra-money/wallet-provider'

function Component() {
  const connectedWallet = useConnectedWallet()

  const postTx = useCallback(async () => {
    if (!connectedWallet) return

    console.log('walletAddress is', connectedWallet.walletAddress)
    console.log('network is', connectedWallet.network)
    console.log('connectType is', connectedWallet.connectType)

    const result = await connectedWallet.post({...})
  }, [])

  return (
    <button disabled={!connectedWallet || !connectedWallet.availablePost} onClick={() => postTx}>
      Post Tx
    </button>
  )
}
```

</details>

<details>

<summary><code>useLCDClient()</code></summary>

```jsx
import { useLCDClient } from '@terra-money/wallet-provider';

function Component() {
  const lcd = useLCDClient();

  const [result, setResult] = useState('');

  useEffect(() => {
    lcd.treasury.taxRate().then((taxRate) => {
      setResult(taxRate.toString());
    });
  }, []);

  return <div>Result: {result}</div>;
}
```

</details>

# Projects for reference

- [Anchor Web App](https://github.com/Anchor-Protocol/anchor-web-app/blob/master/base/src/base/AppProviders.tsx#L154)
- [Mirror Web App](https://github.com/Mirror-Protocol/terra-web-app/blob/master/src/layouts/WalletConnectProvider.tsx#L12)

# Links

- [Releases (Changelog)](https://github.com/terra-money/wallet-provider/releases)

# Trouble-shooting guide

wallet-provider contains the original source codes in sourcemaps.

<img src="https://raw.githubusercontent.com/terra-money/wallet-provider/main/readme-assets/trouble-shooting-guide.png" width="700" style="max-width: 100%" alt="Trouble-Shooting Guide" />

You can check `src/@terra-money/wallet-provider/` in the Chrome Devtools / Sources Tab, and you can also use breakpoints
here for debug.

(It may not be visible depending on your development settings such as Webpack.)

# For Chrome Extension compatible wallet developers

<details>

<summary><code>Chrome Extension compatible wallet development guide</code></summary>

### 1. Create dApp for test

There is the `dangerously__chromeExtensionCompatibleBrowserCheck` option to allow you to create a test environment for
wallet development.

By declaring the `dangerously__chromeExtensionCompatibleBrowserCheck`, you can make your wallet recognized as the chrome
extension.

```jsx
<WalletProvider
  dangerously__chromeExtensionCompatibleBrowserCheck={(userAgent) =>
    /YourWallet/.test(userAgent)
  }
>
  ...
</WalletProvider>
```

### 2. Register your wallet as default allow

If your wallet has been developed,

Please send me your wallet App link (Testlight version is OK)

And send me Pull Request by modifying `DEFAULT_CHROME_EXTENSION_COMPATIBLE_BROWSER_CHECK` in
the `packages/src/@terra-money/wallet-provider/env.ts` file. (or just make an issue is OK)

```diff
export const DEFAULT_CHROME_EXTENSION_COMPATIBLE_BROWSER_CHECK = (userAgent: string) => {
-  return /MathWallet\//.test(userAgent);
+  return /MathWallet\//.test(userAgent) || /YourWallet/.test(userAgent);
}
```

</details>
