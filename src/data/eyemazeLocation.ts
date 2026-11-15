export interface EyemazeStudioLocation {
  businessName: string;
  domain: string;
  addressNepali: string;
  addressEnglish: string;
  plusCode: string;
  locality: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phones: readonly string[];
  email: string;
  googleMapsPlaceUrl: string;
  googleMapsDirectionsUrl: string;
}

export const EYEMAZE_LOCATION: EyemazeStudioLocation = {
  businessName: 'Eyemaze Graphics Enterprises',
  domain: 'eyemaze.com.np',
  addressNepali: 'मरिण–६, छाप, सिन्धुली',
  addressEnglish: 'Marin-6, Chhap, Sindhuli, Nepal',
  plusCode: '7P7J+QX',
  locality: 'Marin Rural Municipality, Kalpabrishykha, Bagmati Province',
  postalCode: '45912',
  coordinates: {
    lat: 27.2644144,
    lng: 85.7323897,
  },
  phones: ['9844251392', '9814850300'],
  email: 'orders@eyemaze.com.np',
  googleMapsPlaceUrl: 'https://maps.app.goo.gl/Xtb9hFNb4vqKxQHa9',
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=27.2644144,85.7323897',
};
