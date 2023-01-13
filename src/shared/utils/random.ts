export class Random {
  /**
   * Generate random number, eg: 0.123456
   * Convert  to base-36 : "0.4fzyo82mvyr"
   * Cut off last 8 characters : "yo82mvyr"
   */
  genPassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  /**
   * Generation random code for send sms
   * Returns a four-digitstring
   */
  randCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
