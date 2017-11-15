

export type FormAliasStatus = 'create' | 'update';

export interface FormAlias {
    status: FormAliasStatus;
    id: number | null;
    select: string;
    fr: string;
    nl: string;
}

export const defaultFormAlias =
    (): FormAlias => ({
        status: 'create',
        id: null,
        select: '',
        fr: '',
        nl: '',
    });
