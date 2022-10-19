# Yield Protocol UI Monorepo

## Included Packages
- core | _[Documentation](https://silver-engine-e5b67cb1.pages.github.io/)_
- react adaptor
- math 
- redux adaptor
- (cli)
- (history)
- (utils)
- (contracts)

## Included Examples
- basic react app 
- ( cli )

## How to use:
### 1. Clean and build ALL packages in the monorepo ( in root dir ): 
> `yarn && yarn clean`
> `yarn bootstrap`
> `yarn compile`

### 2. Propogate any changes made to ANY of the packages ( in root dir ):
> `yarn compile` 


### 3. Start the examples on localhost ( in examples/* dir ): 
> `yarn start`


### 4. Publish global changes  ( in root dir ):  ###
> `lerna publish`

### 4. Publish indivdual packages changes  (in packages/* dir ):  ###
> `yarn version --patch`
> `yarn publish`