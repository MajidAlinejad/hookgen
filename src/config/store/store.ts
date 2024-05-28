import {IConfig, fileTypes, fileTypesEnum} from '../../types.ts';

export class ConfigStore implements IConfig {
  public baseUrl;
  public hook?: 'SWR' | 'ReactQuery' | 'NG';
  public outDir;
  public prettier?;
  public singleJson = false;
  public filter?;
  public resourcePick?: string | undefined;
  public archive?: boolean;
  public definition: string = '';
  public fileTypes: {[key in fileTypesEnum]: fileTypes} = {
    enums: 'ts',
    types: 'd.ts',
    client: 'ts',
    api: 'ts',
    hook: 'ts',
  };
  constructor({
    baseUrl,
    outDir,
    prettier,
    filter,
    hook,
    fileTypes,
    resourcePick,
    archive,
    singleJson = false,
  }: IConfig) {
    this.baseUrl = baseUrl;
    this.outDir = outDir;
    this.outDir = outDir;
    this.resourcePick = resourcePick;
    this.hook = hook;
    this.singleJson = singleJson;
    this.archive = archive;
    this.prettier = prettier;
    this.fileTypes = fileTypes ? fileTypes : this.fileTypes;
    this.filter = filter && new RegExp(filter);
  }

  setDefinition(value: string) {
    this.definition = value;
  }
}
