// =================================================================
// Icones utilisés sur ce site (source : https://reactsvgicons.com/)
// =================================================================
// Exemple d'utilisation, avec paramètres : <SearchIcon width="1rem" height="1rem" color="red" />

// Search Icon
export const SearchIcon = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12z" />
    </svg>
  );
}

// Moon Icon (filled and not)
export const FilledMoonIcon = (props) => {
    return (
        <svg
            fill="currentColor"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            {...props}
        >
            <path d="M264 480A232 232 0 0132 248c0-94 54-178.28 137.61-214.67a16 16 0 0121.06 21.06C181.07 76.43 176 104.66 176 136c0 110.28 89.72 200 200 200 31.34 0 59.57-5.07 81.61-14.67a16 16 0 0121.06 21.06C442.28 426 358 480 264 480z" />
        </svg>
    );
}
export const MoonIcon = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M9.57 3.38a8 8 0 0010.4 10.4 1 1 0 011.31 1.3 10 10 0 11-13-13 1 1 0 011.3 1.3zM7.1 5.04a8 8 0 1011.2 11.23A10 10 0 017.08 5.04z" />
    </svg>
  );
}

// Sun Icon (filled and not)
export const FilledSunIcon = (props) => {
    return (
        <svg
            fill="currentColor"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            {...props}
        >
            <path d="M8 12a4 4 0 100-8 4 4 0 000 8zM8 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 0zm0 13a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 13zm8-5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM3 8a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2A.5.5 0 013 8zm10.657-5.657a.5.5 0 010 .707l-1.414 1.415a.5.5 0 11-.707-.708l1.414-1.414a.5.5 0 01.707 0zm-9.193 9.193a.5.5 0 010 .707L3.05 13.657a.5.5 0 01-.707-.707l1.414-1.414a.5.5 0 01.707 0zm9.193 2.121a.5.5 0 01-.707 0l-1.414-1.414a.5.5 0 01.707-.707l1.414 1.414a.5.5 0 010 .707zM4.464 4.465a.5.5 0 01-.707 0L2.343 3.05a.5.5 0 11.707-.707l1.414 1.414a.5.5 0 010 .708z" />
        </svg>
    );
}
export const SunIcon = (props) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M8 11a3 3 0 110-6 3 3 0 010 6zm0 1a4 4 0 100-8 4 4 0 000 8zM8 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 0zm0 13a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 13zm8-5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM3 8a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2A.5.5 0 013 8zm10.657-5.657a.5.5 0 010 .707l-1.414 1.415a.5.5 0 11-.707-.708l1.414-1.414a.5.5 0 01.707 0zm-9.193 9.193a.5.5 0 010 .707L3.05 13.657a.5.5 0 01-.707-.707l1.414-1.414a.5.5 0 01.707 0zm9.193 2.121a.5.5 0 01-.707 0l-1.414-1.414a.5.5 0 01.707-.707l1.414 1.414a.5.5 0 010 .707zM4.464 4.465a.5.5 0 01-.707 0L2.343 3.05a.5.5 0 11.707-.707l1.414 1.414a.5.5 0 010 .708z" />
    </svg>
  );
}

// Home Icon
export const HomeIcon = (props) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M261.56 101.28a8 8 0 00-11.06 0L66.4 277.15a8 8 0 00-2.47 5.79L63.9 448a32 32 0 0032 32H192a16 16 0 0016-16V328a8 8 0 018-8h80a8 8 0 018 8v136a16 16 0 0016 16h96.06a32 32 0 0032-32V282.94a8 8 0 00-2.47-5.79z" />
      <path d="M490.91 244.15l-74.8-71.56V64a16 16 0 00-16-16h-48a16 16 0 00-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0043 267.56L250.5 69.28a8 8 0 0111.06 0l207.52 198.28a16 16 0 0022.59-.44c6.14-6.36 5.63-16.86-.76-22.97z" />
    </svg>
  );
}

// Blocks Icon
export const BlocksIcon = (props) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M856 376H648V168c0-8.8-7.2-16-16-16H168c-8.8 0-16 7.2-16 16v464c0 8.8 7.2 16 16 16h208v208c0 8.8 7.2 16 16 16h464c8.8 0 16-7.2 16-16V392c0-8.8-7.2-16-16-16zm-480 16v188H220V220h360v156H392c-8.8 0-16 7.2-16 16zm204 52v136H444V444h136zm224 360H444V648h188c8.8 0 16-7.2 16-16V444h156v360z" />
    </svg>
  );
}

// Exchange Icon
export const ExchangeIcon = (props) => {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M7 18 A2 2 0 0 1 5 20 A2 2 0 0 1 3 18 A2 2 0 0 1 7 18 z" />
      <path d="M21 6 A2 2 0 0 1 19 8 A2 2 0 0 1 17 6 A2 2 0 0 1 21 6 z" />
      <path d="M19 8v5a5 5 0 01-5 5h-3l3-3m0 6l-3-3M5 16v-5a5 5 0 015-5h3l-3-3m0 6l3-3" />
    </svg>
  );
}

// Vote Icon
export const VoteIcon = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M18 13l3 3v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4l3-3h.83l2 2H6.78L5 17h14l-1.77-2h-1.91l2-2H18m1 7v-1H5v1h14m-7.66-5l-4.95-4.93a.996.996 0 010-1.41l6.37-6.37a.975.975 0 011.4.01l4.95 4.95c.39.39.39 1.02 0 1.41L12.75 15a.962.962 0 01-1.41 0m2.12-10.59L8.5 9.36l3.55 3.54L17 7.95l-3.54-3.54z" />
    </svg>
  );
}

// Lock Icon
export const LockIcon = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M12 2C9.243 2 7 4.243 7 7v2H6c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v2H9V7zm9.002 13H13v-2.278c.595-.347 1-.985 1-1.722 0-1.103-.897-2-2-2s-2 .897-2 2c0 .736.405 1.375 1 1.722V20H6v-9h12l.002 9z" />
    </svg>
  );
}

// Circle Question Icon
export const CircleQuestionIcon = (props) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
      <path d="M5.255 5.786a.237.237 0 00.241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 00.25.246h.811a.25.25 0 00.25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
    </svg>
  );
}

// Burger Menu
export const BurgerMenu = (props) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z" />
    </svg>
  );
}

// Dashboard Icon
export const DashboardIcon = (props) => {
  return (
    <svg
      data-name="Layer 1"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M19.088 4.955c-.007-.008-.01-.019-.017-.026s-.018-.01-.026-.018a9.979 9.979 0 00-14.09 0c-.008.008-.018.01-.026.018s-.01.018-.017.026a10 10 0 1014.176 0zM12 20a7.985 7.985 0 01-6.235-3H9.78a2.964 2.964 0 004.44 0h4.015A7.985 7.985 0 0112 20zm-1-5a1 1 0 111 1 1.001 1.001 0 01-1-1zm8.41.002L19.4 15H15a2.995 2.995 0 00-2-2.816V9a1 1 0 00-2 0v3.184A2.995 2.995 0 009 15H4.6l-.01.002A7.93 7.93 0 014.07 13H5a1 1 0 000-2h-.93a7.951 7.951 0 011.619-3.898l.654.655a1 1 0 101.414-1.414l-.654-.655A7.952 7.952 0 0111 4.07V5a1 1 0 002 0v-.93a7.952 7.952 0 013.897 1.618l-.654.655a1 1 0 101.414 1.414l.654-.655A7.951 7.951 0 0119.931 11H19a1 1 0 000 2h.93a7.93 7.93 0 01-.52 2.002z" />
    </svg>
  );
}

// Params Icon
export const ParamsIcon = (props) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M368 128h80M64 128h240M368 384h80M64 384h240M208 256h240M64 256h80"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M368 128 A32 32 0 0 1 336 160 A32 32 0 0 1 304 128 A32 32 0 0 1 368 128 z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M208 256 A32 32 0 0 1 176 288 A32 32 0 0 1 144 256 A32 32 0 0 1 208 256 z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M368 384 A32 32 0 0 1 336 416 A32 32 0 0 1 304 384 A32 32 0 0 1 368 384 z"
      />
    </svg>
  );
}


// Stack1 Icon
export const Stack1Icon = (props) => {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M16 5L8 1 0 5l8 4 8-4zM8 2.328L13.345 5 8 7.672 2.655 5 8 2.328zm6.398 4.871L16 8l-8 4-8-4 1.602-.801L8 10.398zm0 3L16 11l-8 4-8-4 1.602-.801L8 13.398z"
      />
    </svg>
  );
}


// Overview Icon
export const OverviewIcon = (props) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M320 64c0-35.3-28.7-64-64-64s-64 28.7-64 64 28.7 64 64 64 64-28.7 64-64zm-96 96c-35.3 0-64 28.7-64 64v48c0 17.7 14.3 32 32 32h1.8l11.1 99.5c1.8 16.2 15.5 28.5 31.8 28.5h38.7c16.3 0 30-12.3 31.8-28.5l11-99.5h1.8c17.7 0 32-14.3 32-32v-48c0-35.3-28.7-64-64-64h-64zm-91.7 234.2c13-2.4 21.7-14.9 19.3-27.9s-14.9-21.7-27.9-19.3c-32.4 5.9-60.9 14.2-82 24.8-10.5 5.3-20.3 11.7-27.8 19.6C6.4 399.5 0 410.5 0 424c0 21.4 15.5 36.1 29.1 45 14.7 9.6 34.3 17.3 56.4 23.4C130.2 504.7 190.4 512 256 512s125.8-7.3 170.4-19.6c22.1-6.1 41.8-13.8 56.4-23.4 13.7-8.9 29.1-23.6 29.1-45 0-13.5-6.4-24.5-14-32.6-7.5-7.9-17.3-14.3-27.8-19.6-21-10.6-49.5-18.9-82-24.8-13-2.4-25.5 6.3-27.9 19.3s6.3 25.5 19.3 27.9c30.2 5.5 53.7 12.8 69 20.5 3.2 1.6 5.8 3.1 7.9 4.5 3.6 2.4 3.6 7.2 0 9.6-8.8 5.7-23.1 11.8-43 17.3C374.3 457 318.5 464 256 464s-118.3-7-157.7-17.9c-19.9-5.5-34.2-11.6-43-17.3-3.6-2.4-3.6-7.2 0-9.6 2.1-1.4 4.8-2.9 7.9-4.5 15.3-7.7 38.8-14.9 69-20.5z" />
    </svg>
  );
}


// Calculator Icon
export const CalculatorIcon = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M5.5 8H6v.5a1 1 0 002 0V8h.5a1 1 0 000-2H8v-.5a1 1 0 00-2 0V6h-.5a1 1 0 000 2zm-.62 11.12a1 1 0 001.41 0l.71-.71.71.71a1 1 0 001.41 0 1 1 0 000-1.41L8.41 17l.71-.71a1 1 0 00-1.41-1.41l-.71.71-.71-.71a1 1 0 00-1.41 1.41l.71.71-.71.71a1 1 0 000 1.41zM20 1H4a3 3 0 00-3 3v16a3 3 0 003 3h16a3 3 0 003-3V4a3 3 0 00-3-3zm-9 20H4a1 1 0 01-1-1v-7h8zm0-10H3V4a1 1 0 011-1h7zm10 9a1 1 0 01-1 1h-7v-8h8zm0-9h-8V3h7a1 1 0 011 1zm-5.5 5.5h3a1 1 0 000-2h-3a1 1 0 000 2zm3-10.5h-3a1 1 0 000 2h3a1 1 0 000-2zm-3 13.5h3a1 1 0 000-2h-3a1 1 0 000 2z" />
    </svg>
  );
}