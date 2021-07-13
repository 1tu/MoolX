export interface IDGeolocationResponseDTO {
  coords: IDGeolocationCoordsDTO;
  timestamp: number;
}

export interface IDGeolocationCoordsDTO {
  latitude: number;
  longitude: number;
  accuracy: number;
}
