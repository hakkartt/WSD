import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import * as accountService from "../../services/accountService.js";

const listAccounts = async ({ request, response, render, state }) => {
    const a = await state.session.get("authenticated");
    if (!a) {
        response.status = 401;
        return;
    }
    const body = request.body();
    const params = await body.value;
    const userId = (await state.session.get("user")).id;
    const accounts = await accountService.findAccountsByUser(userId);
    render("accounts.eta", {accounts: accounts.rows});
}

const addAccount = async ({ request, response, state }) => {
    const a = await state.session.get("authenticated");
    if (!a) {
        response.status = 401;
        return;
    }
    const body = request.body();
    const params = await body.value;
    const userId = (await state.session.get("user")).id;
    await accountService.addAccount(params.get("name"), userId);
    response.redirect("/accounts");
}

const showAccount = async ({ params, render }) => {
    const id = params.id;
    const account = (await accountService.findAccountById(id)).rows[0];
    render("account.eta", account);
}

const deposit = async  ({ params, request, response, state }) => {

    const body = request.body();
    const parameters = await body.value;
    const id = params.id;
    const account_user_id = (await accountService.findAccountById(id)).rows[0].user_id;
    const auth_user_id = (await state.session.get("user")).id;
    const a = (account_user_id === auth_user_id);

    if (a) {
        await accountService.deposit(id, parameters.get("amount"));
        response.redirect("/accounts");
    } else {
        response.status = 401;
    }
}

const withdraw = async  ({ params, request, response, state }) => {

    const body = request.body();
    const parameters = await body.value;
    const id = params.id;
    const account_user_id = (await accountService.findAccountById(id)).rows[0].user_id;
    const auth_user_id = (await state.session.get("user")).id;
    const a = (account_user_id === auth_user_id);
    const b = await accountService.hasEnough(id, parameters.get("amount"));

    if (a && b) {
        await accountService.withdraw(id, parameters.get("amount"));
        response.redirect("/accounts");
    } else {
        response.status = 401;
    }
}

export { listAccounts, addAccount, showAccount, deposit, withdraw };