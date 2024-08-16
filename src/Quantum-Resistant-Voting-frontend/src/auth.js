import { AuthClient } from "@dfinity/auth-client";

let authClient;

export const initAuth = async() => {
    authClient = await AuthClient.create();
};

export const login = async() => {
    const APP_NAME = "Quantum Resistant Voting";
    const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
    const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;

    const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;

    await authClient.login({
        identityProvider,
        onSuccess: () => {
            window.location.reload();
        },
        windowOpenerFeatures: `
      left=${window.screen.width / 2 - 525 / 2},
      top=${window.screen.height / 2 - 705 / 2},
      toolbar=0,location=0,menubar=0,width=525,height=705
    `,
    });
};

export const logout = async() => {
    await authClient.logout();
    window.location.reload();
};

export const getIdentity = async() => {
    return authClient.getIdentity();
};
