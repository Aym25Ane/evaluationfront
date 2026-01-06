import { KeycloakService } from 'keycloak-angular';
export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>{};
    // keycloak.init({
    //   config: {
    //     url: 'http://localhost:8080',
    //     realm: 'yolearn',
    //     clientId: 'yolearn-client'
    //   },
    //   initOptions: {
    //     onLoad: 'check-sso',
    //     silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    //     checkLoginIframe: false
    //   },
    //   enableBearerInterceptor: true,
    //   bearerPrefix: 'Bearer',
    //
    //   bearerExcludedUrls: ['/assets']
    // });
}

