import { lowerCase, upperFirst, map } from 'lodash'

const reverbNames = ['AbernyteGrainSilo', 'Basement', 'DomesticLivingRoom', 'InsidePiano', 'EmptyApartmentBedroom', 'FalklandPalaceRoyalTennisCourt']
const origin = 'https://rawcdn.githack.com/'
const prefix = 'burnson/Reverb.js/22db0aee971871ae51f55ffd082d197dd96ceaaf/Library/'
const extension = '.wav'

const reverbs = [{
  name: 'None',
  url: '',
}]

reverbs.push(...map(
  reverbNames,
  (name) => {
    return {
      name: upperFirst(lowerCase(name)),
      url: `${origin}${prefix}${name}${extension}`,
    }
  }
))

export default reverbs