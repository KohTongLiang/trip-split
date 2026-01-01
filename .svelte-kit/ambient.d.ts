
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const DATABASE_URL: string;
	export const DIRECT_URL: string;
	export const PYENV_VIRTUALENV_INIT: string;
	export const LESSOPEN: string;
	export const npm_package_dependencies__supabase_ssr: string;
	export const CONDA_PROMPT_MODIFIER: string;
	export const USER: string;
	export const npm_package_dependencies__sveltejs_adapter_node: string;
	export const npm_config_version_commit_hooks: string;
	export const npm_config_user_agent: string;
	export const npm_config_bin_links: string;
	export const npm_node_execpath: string;
	export const npm_config_init_version: string;
	export const SHLVL: string;
	export const npm_package_dependencies__supabase_supabase_js: string;
	export const HOME: string;
	export const CONDA_SHLVL: string;
	export const NVM_BIN: string;
	export const PYENV_SHELL: string;
	export const NVM_INC: string;
	export const npm_config_init_license: string;
	export const YARN_WRAP_OUTPUT: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const npm_config_version_tag_prefix: string;
	export const npm_package_scripts_check: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const _CE_M: string;
	export const WSL_DISTRO_NAME: string;
	export const npm_package_description: string;
	export const npm_package_dependencies__sveltejs_kit: string;
	export const npm_package_devDependencies_typescript: string;
	export const NVM_DIR: string;
	export const npm_package_readmeFilename: string;
	export const WAYLAND_DISPLAY: string;
	export const npm_package_dependencies_tslib: string;
	export const npm_package_dependencies_svelte: string;
	export const npm_package_scripts_dev: string;
	export const LOGNAME: string;
	export const npm_package_type: string;
	export const NAME: string;
	export const WSL_INTEROP: string;
	export const PULSE_SERVER: string;
	export const _: string;
	export const npm_package_scripts_check_watch: string;
	export const npm_package_private: string;
	export const npm_package_dependencies__prisma_client: string;
	export const npm_config_registry: string;
	export const TERM: string;
	export const _CE_CONDA: string;
	export const npm_package_scripts_start: string;
	export const npm_config_ignore_scripts: string;
	export const PATH: string;
	export const NODE: string;
	export const npm_package_devDependencies_prisma: string;
	export const npm_package_name: string;
	export const XDG_RUNTIME_DIR: string;
	export const DISPLAY: string;
	export const LANG: string;
	export const LS_COLORS: string;
	export const npm_lifecycle_script: string;
	export const CONDA_PYTHON_EXE: string;
	export const npm_config_version_git_message: string;
	export const SHELL: string;
	export const npm_lifecycle_event: string;
	export const npm_package_version: string;
	export const npm_config_argv: string;
	export const npm_package_scripts_build: string;
	export const LESSCLOSE: string;
	export const CONDA_DEFAULT_ENV: string;
	export const npm_package_dependencies_vite: string;
	export const npm_package_dependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_config_version_git_tag: string;
	export const npm_config_version_git_sign: string;
	export const npm_config_strict_ssl: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const CONDA_EXE: string;
	export const NVM_CD_FLAGS: string;
	export const PYENV_ROOT: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_save_prefix: string;
	export const npm_config_ignore_optional: string;
	export const CONDA_PREFIX: string;
	export const npm_package_scripts_preview: string;
	export const WSL2_GUI_APPS_ENABLED: string;
	export const HOSTTYPE: string;
	export const INIT_CWD: string;
	export const WSLENV: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_SUPABASE_URL: string;
	export const PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		DATABASE_URL: string;
		DIRECT_URL: string;
		PYENV_VIRTUALENV_INIT: string;
		LESSOPEN: string;
		npm_package_dependencies__supabase_ssr: string;
		CONDA_PROMPT_MODIFIER: string;
		USER: string;
		npm_package_dependencies__sveltejs_adapter_node: string;
		npm_config_version_commit_hooks: string;
		npm_config_user_agent: string;
		npm_config_bin_links: string;
		npm_node_execpath: string;
		npm_config_init_version: string;
		SHLVL: string;
		npm_package_dependencies__supabase_supabase_js: string;
		HOME: string;
		CONDA_SHLVL: string;
		NVM_BIN: string;
		PYENV_SHELL: string;
		NVM_INC: string;
		npm_config_init_license: string;
		YARN_WRAP_OUTPUT: string;
		npm_package_devDependencies_svelte_check: string;
		npm_config_version_tag_prefix: string;
		npm_package_scripts_check: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		_CE_M: string;
		WSL_DISTRO_NAME: string;
		npm_package_description: string;
		npm_package_dependencies__sveltejs_kit: string;
		npm_package_devDependencies_typescript: string;
		NVM_DIR: string;
		npm_package_readmeFilename: string;
		WAYLAND_DISPLAY: string;
		npm_package_dependencies_tslib: string;
		npm_package_dependencies_svelte: string;
		npm_package_scripts_dev: string;
		LOGNAME: string;
		npm_package_type: string;
		NAME: string;
		WSL_INTEROP: string;
		PULSE_SERVER: string;
		_: string;
		npm_package_scripts_check_watch: string;
		npm_package_private: string;
		npm_package_dependencies__prisma_client: string;
		npm_config_registry: string;
		TERM: string;
		_CE_CONDA: string;
		npm_package_scripts_start: string;
		npm_config_ignore_scripts: string;
		PATH: string;
		NODE: string;
		npm_package_devDependencies_prisma: string;
		npm_package_name: string;
		XDG_RUNTIME_DIR: string;
		DISPLAY: string;
		LANG: string;
		LS_COLORS: string;
		npm_lifecycle_script: string;
		CONDA_PYTHON_EXE: string;
		npm_config_version_git_message: string;
		SHELL: string;
		npm_lifecycle_event: string;
		npm_package_version: string;
		npm_config_argv: string;
		npm_package_scripts_build: string;
		LESSCLOSE: string;
		CONDA_DEFAULT_ENV: string;
		npm_package_dependencies_vite: string;
		npm_package_dependencies__sveltejs_vite_plugin_svelte: string;
		npm_config_version_git_tag: string;
		npm_config_version_git_sign: string;
		npm_config_strict_ssl: string;
		PWD: string;
		npm_execpath: string;
		CONDA_EXE: string;
		NVM_CD_FLAGS: string;
		PYENV_ROOT: string;
		XDG_DATA_DIRS: string;
		npm_config_save_prefix: string;
		npm_config_ignore_optional: string;
		CONDA_PREFIX: string;
		npm_package_scripts_preview: string;
		WSL2_GUI_APPS_ENABLED: string;
		HOSTTYPE: string;
		INIT_CWD: string;
		WSLENV: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_SUPABASE_URL: string;
		PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
