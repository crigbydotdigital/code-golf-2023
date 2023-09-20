# Movie Marathon Challenge

## Description

This repo contains a solution to the movie marathon challenge defined [here](https://paper.dropbox.com/doc/Code-Golf-2023-The-Magnificent-Movie-Marathon-Problem--CAXMQ5tS1rxeHznp2LO26vH9Ag-GciVL0XU7muDq9tjGGWXV). The code is written in JavaScript and minified using `uglifyjs`. The unminified code can be found at `movie-marathon.js`.

The final total rating and size of the minified solution (`movie-marathon.min.js`) are as follows.

| Total Rating | Size in bytes (characters) |
| ------------ | -------------------------- |
| 150          | 688                        |

## How to Run

To generate a schedule, run the following command from the repository root.

```sh
node ./movie-marathon.min.js
```

This has been tested using node 18 but should also work on most other versions as well.

The code also requires the file containing the movies JSON to be named `m` and be present in the same directory. That file already exists in this repo but it's a relevant point if you want to run this solution on another dataset.

## Use of AI

I most prominently used AI (Chat-GPT) to generate a solution that I could benchmark my own solution against. I started with prompting Chat-GPT, using the GPT-4 model, to generate a JavaScript solution for the movie marathon challenge that adhered to all of the rules and output a schedule in the correct format. After tweaking the promt a few times to get a valid solution, I copied the code to `movie-marathon-gpt.js` and cleaned up the code slightly. I then minified that solution (`movie-marathon-gpt.min.js`) and used it as a benchmark to compare my own solution against. I ultimately managed to beat that benchmark on both total rating (150 vs 133.4) and size (688 B vs 886 B).

On top of the benchmark solution, I also used GitHub Copilot to help write the solution and find optimal functions for size.
