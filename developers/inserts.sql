INSERT INTO public.bots_bot (id, token, name, response_all, description, "createdAt") VALUES (1, '', '', true, NULL, '2021-08-03 00:00:00+00');

ALTER SEQUENCE handlers_handler_id_seq RESTART WITH 1;

INSERT INTO public.handlers_handler (enabled, name, description, command, "createdAt", bot_id, payload, response_profile_id) VALUES ( true, '', NULL, '/start', '2021-08-03 00:00:00+00', 1, '{"type": "message", "content": "Welcome {{ first_name }} you must wait for the approval of an administrator"}', 1);
/* RESERVED 50 for telegram commands */
ALTER SEQUENCE handlers_handler_id_seq RESTART WITH 50;


INSERT INTO public.handlers_handler (enabled, name, description, command, "createdAt", bot_id, payload, response_profile_id) VALUES ( false, '', NULL, '/userList', '2021-03-11 23:56:51.035603+00', 1, '{"url": "http://telegram-bot-server:8000/api/users/list/", "type": "http", "method": "post"}', 1);
/* RESERVED 50 for Bot manager interal administrator commands */

ALTER SEQUENCE handlers_handler_id_seq RESTART WITH 100;

INSERT INTO public.profiles_profile (id, name, description, "createdAt") VALUES (1, 'Administrador', NULL, '2021-03-11 23:55:42.611176+00');
INSERT INTO public.profiles_profile (id, name, description, "createdAt") VALUES (2, 'Default', NULL, '2021-08-03 00:00:00+00');
