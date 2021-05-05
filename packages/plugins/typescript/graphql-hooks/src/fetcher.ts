import { OperationDefinitionNode } from 'graphql';

export interface FetcherRenderer {
  generateImplementation: () => string;
  generateQueryHook: (
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationName: string,
    operationResultType: string,
    operationVariablesTypes: string,
    hasRequiredVariables: boolean
  ) => string;
  generateMutationHook: (
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationName: string,
    operationResultType: string,
    operationVariablesTypes: string
  ) => string;
}
