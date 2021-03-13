# Telegram bot manager
## Objetive
The objective of this project is to create an open source system for the management of telegram bots with the ability to respond to handlers through http apis.

## Get start

1. [Install docker engine](https://docs.docker.com/engine/install/)
    * Configure for use with out sudo.
2. Clone this repository:

    ```bash
    $: git clone https://github.com/Ymil/telegram-bot-manager.git
    $: cd telegram-bot-manager
    ```
3. Build images

    ```bash
    $: docker-compose -f bot-manager-build.yml build
    ```

4. Run stack
    ```bash
    $: docker-compose -f bot-manager-stack.yml up -d
    ```

5. Configure database
    ```bash
    docker-compose -f bot-manager-stack.yml up -d
    docker exec -it telegram-bot-db psql --user postgres -c "create 
    database botmanager"
    docker exec -it telegram-bot-server bash -c "python manager.py makemigrates; python manager.py migrate";
    ```

6. Create first bot, remplace variables $bot_name and $bot_token
    ```bash
        INSERT INTO public.bots_bot (id, token, name, response_all, description) VALUES (1, "$bot_name", "$bot_token", false, NULL);
    ```

    6.1 And copy and insert to

    ```bash
        docker exec -it telegram-bot-db psql --user postgres
    ``` 
    After copy developers/insert.sql to postgres shell

7. Restart task
    ```bash
    docker-compose -f bot-manager-stack.yml down
    docker-compose -f bot-manager-stack.yml up -d
    ```