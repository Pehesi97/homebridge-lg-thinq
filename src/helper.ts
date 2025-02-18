import { Categories } from 'homebridge';
import {Device} from './lib/Device';
import AirPurifier from './devices/AirPurifier';
import Refrigerator from './devices/Refrigerator';
import WasherDryer from './devices/WasherDryer';
import Dishwasher from './devices/Dishwasher';
import Dehumidifier from './devices/Dehumidifier';
import {default as V1helper} from './v1/helper';
import {PlatformType} from './lib/constants';
import AirConditioner from './devices/AirConditioner';
import AeroTower from './devices/AeroTower';
import Styler from './devices/Styler';
import RangeHood from './devices/RangeHood';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class Helper {
  public static make(device: Device) {
    if (device.platform === PlatformType.ThinQ1) {
      // check if thinq1 available
      const deviceClass = V1helper.make(device);
      if (deviceClass) {
        return deviceClass;
      }
    }

    // thinq2
    switch (device.type) {
      case 'AERO_TOWER': return AeroTower;
      case 'AIR_PURIFIER': return AirPurifier;
      case 'REFRIGERATOR': return Refrigerator;
      case 'WASHER':
      case 'WASHER_NEW':
      case 'WASH_TOWER':
        return WasherDryer;
      case 'DRYER': return WasherDryer;
      case 'DISHWASHER': return Dishwasher;
      case 'DEHUMIDIFIER': return Dehumidifier;
      case 'AC': return AirConditioner;
      case 'STYLER': return Styler;
      case 'HOOD': return RangeHood;
    }

    return null;
  }

  public static category(device: Device) {
    switch (device.type) {
      case 'AIR_PURIFIER': return Categories.AIR_PURIFIER;
      case 'DEHUMIDIFIER': return Categories.AIR_DEHUMIDIFIER;
      case 'AC': return Categories.AIR_CONDITIONER;
      default: return Categories.OTHER;
    }
  }
}

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function fToC(fahrenheit) {
  return parseFloat(((fahrenheit - 32) * 5 / 9).toFixed(1));
}

export function cToF(celsius) {
  return Math.round(celsius * 9 / 5 + 32);
}
