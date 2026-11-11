export type Coordinates = {
  latitude: number
  longitude: number
}

export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {
      reject(
        new Error(
          'Location services are not supported by this browser.'
        )
      )

      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },

      error => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new Error(
              'Location permission was denied.'
            )
          )

          return
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(
            new Error(
              'Your current location could not be determined.'
            )
          )

          return
        }

        if (error.code === error.TIMEOUT) {
          reject(
            new Error(
              'Location request timed out.'
            )
          )

          return
        }

        reject(
          new Error(
            'Could not determine your location.'
          )
        )
      },

      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  })
}