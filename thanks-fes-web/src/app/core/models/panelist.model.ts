export class Panelist {
  id: number;
  name: string;
  team: string;

  constructor(param?: Panelist) {
    this.id = param ? param.id : undefined;
    this.name = param ? param.name : '';
    this.team = param ? param.team : '';
  }
}

export class GetPanelistIdRequest {
  name: string;
}

export class CreatePanelistRequest {
  name: string;
  team: string;
}

export type RegisteredPanelistCount = { team: string; count: number };
