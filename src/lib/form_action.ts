import { applyAction } from '$app/forms';
import { invalidateAll } from '$app/navigation';
import toast from 'svelte-french-toast';
import { loading } from '$state/loading';
import type { ActionResult } from '@sveltejs/kit';

type FormActionMessage = {
	message?: string;
};

export const form_action = (
	opts?: FormActionMessage,
	pre?: (data?: any | unknown) => any,
	callback?: (data?: any | unknown) => any
) => {
	return function form_enhance() {
		if (pre) pre();
		loading.setLoading(true);
		return async ({ result }: { result: ActionResult<{ message: string }> }) => {
			console.log(result);
			if (result.type === 'success') {
				toast.success('Siiiiick ' + result?.data?.message + ' was a success');
			} else if (result.type === 'error') {
				console.log(result);
				toast.error(`Major bummer: ${result.error.message}`);
			} else {
				toast.error(`Something went wrong. Check the console`);
				console.log(result);
			}
			await invalidateAll();
			await applyAction(result);
			loading.setLoading(false);
			if (callback && 'data' in result && result?.data) callback(result.data);
		};
	};
};
