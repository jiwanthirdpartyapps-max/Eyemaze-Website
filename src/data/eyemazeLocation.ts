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
  locality: 'Kalpabrishykha, Bagmati Province',
  postalCode: '45900',
  coordinates: {
    lat: 27.2644144,
    lng: 85.7323897,
  },
  phones: ['9844251392', '9814850300'],
  email: 'orders@eyemaze.com.np',
  googleMapsPlaceUrl:
    'https://www.google.com/maps/place/Eyemaze+Graphics+Enterprises/@27.2642069,85.7319885,85m/data=!3m1!1e3!4m20!1m13!4m12!1m4!2m2!1d85.7324393!2d27.2641654!4e1!1m6!1m2!1s0x39eb840a871edeff:0xc525fad917eb53cb!2s7P7J%2BQX,+Kalpabrishykha,+Bagmati+Province+45900!2m2!1d85.7324375!2d27.2644375!3m5!1s0x39eb85373ddf9c4b:0xaf6db41acaebe062!8m2!3d27.2644144!4d85.7323897!16s%2Fg%2F11hzr49t0w?entry=ttu',
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=27.2644144,85.7323897',
};
