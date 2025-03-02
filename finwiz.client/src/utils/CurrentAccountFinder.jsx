export const getCurrentAccount = (accounts, accountId) => {
    if (!accountId || !accounts || accounts.length === 0) return null;
    return accounts.find(acc => String(acc.id) === String(accountId)) || null;
};