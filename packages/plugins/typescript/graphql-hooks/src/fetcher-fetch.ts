import { OperationDefinitionNode } from 'graphql';
import { ReactQueryVisitor } from './visitor';
import { FetcherRenderer } from './fetcher';
// import { generateQueryKey } from './variables-generator';

export class FetchFetcher implements FetcherRenderer {
  constructor(private visitor: ReactQueryVisitor) {}

  generateImplementation(): string {
    return `interface TypedQuery<Type> extends UseClientRequestResult<any> {
      data?: Type
    }`;
  }

  generateQueryHook(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationName: string,
    operationResultType: string,
    operationVariablesTypes: string
  ): string {
    const hookConfig = this.visitor.queryMethodMap;
    this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.hook);
    this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.options);

    const options = `options?: ${hookConfig.query.options}<${operationVariablesTypes}>`;

    return `export const use${operationName}: UseQueryResult<TypedQuery<${operationName}>, ${operationVariablesTypes}> = (
      ${options}
    ) => 
    ${hookConfig.query.hook}(
      ${documentVariableName},
      options
    );`;
  }

  generateMutationHook(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationName: string,
    operationResultType: string,
    operationVariablesTypes: string
  ): string {
    const hookConfig = this.visitor.queryMethodMap;
    this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.hook);
    this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.options);

    const options = `options?: ${hookConfig.mutation.options}<${operationVariablesTypes}>`;

    return `export const use${operationName}: [
      FetchData<TypedQuery<${operationName}>, ${operationVariablesTypes}>,
      UseClientRequestResult<TypedQuery<${operationName}>>,
      ResetFunction
    ] = (
      ${options}
    ) => 
    ${hookConfig.mutation.hook}(
      ${documentVariableName},
      options
    );`;
  }
}
