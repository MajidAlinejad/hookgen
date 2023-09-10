import {IConfig, fileTypes, fileTypesEnum} from '../../types.ts';

export class ConfigStore implements IConfig {
  public baseUrl;
  public hook?: 'SWR' | 'ReactQuery';
  public outDir;
  public prettier?;
  public filter?;
  public archive?: boolean;
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
    archive,
  }: IConfig) {
    this.baseUrl = baseUrl;
    this.outDir = outDir;
    this.hook = hook;
    this.archive = archive;
    this.prettier = prettier;
    this.fileTypes = fileTypes ? fileTypes : this.fileTypes;
    this.filter = filter && new RegExp(filter, 'g');
  }
}
