
❯ /home/obsidan/Development/Projects/project-manifold
❯ poetry install
Creating virtualenv project-manifold-RpTW1xKR-py3.13 in /home/obsidan/.cache/pypoetry/virtualenvs
Updating dependencies
Resolving dependencies... (14.7s)

Package operations: 140 installs, 0 updates, 0 removals

  - Installing attrs (25.4.0)
  - Installing rpds-py (0.30.0)
  - Installing referencing (0.37.0)
  - Installing six (1.17.0)
  - Installing jsonschema-specifications (2025.9.1)
  - Installing platformdirs (4.5.1)
  - Installing python-dateutil (2.9.0.post0)
  - Installing traitlets (5.14.3)
  - Installing tzdata (2025.3)
  - Installing arrow (1.4.0)
  - Installing lark (1.3.1)
  - Installing jupyter-core (5.9.1)
  - Installing pycparser (2.23)
  - Installing fastjsonschema (2.21.2)
  - Installing jsonschema (4.25.1)
  - Installing pyzmq (25.1.2): Failed

PEP517 build of a dependency failed

Backend subprocess exited when trying to invoke build_wheel

    | Command '['/tmp/tmpc4qlqwn5/.venv/bin/python', '/home/obsidan/.local/share/pypoetry/venv/lib/python3.13/site-packages/pyproject_hooks/_in_process/_in_process.py', 'build_wheel', '/tmp/tmpnmdne9oi']' returned non-zero exit status 1.
    | 
    | /tmp/tmpc4qlqwn5/.venv/lib/python3.13/site-packages/setuptools/_distutils/dist.py:289: UserWarning: Unknown distribution option: 'cffi_modules'
    |   warnings.warn(msg)
    | toml section missing PosixPath('pyproject.toml') does not contain a tool.setuptools_scm section
    | /tmp/tmpc4qlqwn5/.venv/lib/python3.13/site-packages/setuptools/dist.py:759: SetuptoolsDeprecationWarning: License classifiers are deprecated.
    | !!
    | 
    |         ********************************************************************************
    |         Please consider removing the following classifiers in favor of a SPDX license expression:
    | 
    |         License :: OSI Approved :: GNU Library or Lesser General Public License (LGPL)
    |         License :: OSI Approved :: BSD License
    | 
    |         See https://packaging.python.org/en/latest/guides/writing-pyproject-toml/#license for details.
    |         ********************************************************************************
    | 
    | !!
    |   self._finalize_license_expression()
    | running bdist_wheel
    | running build
    | running build_py
    | copying zmq/error.py -> build/lib.linux-x86_64-cpython-313/zmq
    | copying zmq/decorators.py -> build/lib.linux-x86_64-cpython-313/zmq
    | copying zmq/constants.py -> build/lib.linux-x86_64-cpython-313/zmq
    | copying zmq/asyncio.py -> build/lib.linux-x86_64-cpython-313/zmq
    | copying zmq/_typing.py -> build/lib.linux-x86_64-cpython-313/zmq
    | copying zmq/_future.py -> build/lib.linux-x86_64-cpython-313/zmq
    | copying zmq/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq
    | creating build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/z85.py -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/win32.py -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/strtypes.py -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/monitor.py -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/jsonapi.py -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/interop.py -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/garbage.py -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | creating build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_zmqstream.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_z85.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_win32_shim.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_version.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_ssh.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_socket.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_security.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_retry_eintr.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_reqrep.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_pubsub.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_proxy_steerable.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_poll.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_pair.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_mypy.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_multipart.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_monqueue.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_monitor.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_message.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_log.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_ioloop.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_includes.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_imports.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_future.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_ext.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_etc.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_error.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_draft.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_device.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_decorators.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_cython.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_context.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_constants.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_cffi_backend.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_auth.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/test_asyncio.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/conftest.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/tests/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | creating build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/sugar/version.py -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/sugar/tracker.py -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/sugar/stopwatch.py -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/sugar/socket.py -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/sugar/poll.py -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/sugar/frame.py -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/sugar/context.py -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/sugar/attrsettr.py -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/sugar/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | creating build/lib.linux-x86_64-cpython-313/zmq/ssh
    | copying zmq/ssh/tunnel.py -> build/lib.linux-x86_64-cpython-313/zmq/ssh
    | copying zmq/ssh/forward.py -> build/lib.linux-x86_64-cpython-313/zmq/ssh
    | copying zmq/ssh/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/ssh
    | creating build/lib.linux-x86_64-cpython-313/zmq/log
    | copying zmq/log/handlers.py -> build/lib.linux-x86_64-cpython-313/zmq/log
    | copying zmq/log/__main__.py -> build/lib.linux-x86_64-cpython-313/zmq/log
    | copying zmq/log/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/log
    | creating build/lib.linux-x86_64-cpython-313/zmq/green
    | copying zmq/green/poll.py -> build/lib.linux-x86_64-cpython-313/zmq/green
    | copying zmq/green/device.py -> build/lib.linux-x86_64-cpython-313/zmq/green
    | copying zmq/green/core.py -> build/lib.linux-x86_64-cpython-313/zmq/green
    | copying zmq/green/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/green
    | creating build/lib.linux-x86_64-cpython-313/zmq/green/eventloop
    | copying zmq/green/eventloop/zmqstream.py -> build/lib.linux-x86_64-cpython-313/zmq/green/eventloop
    | copying zmq/green/eventloop/ioloop.py -> build/lib.linux-x86_64-cpython-313/zmq/green/eventloop
    | copying zmq/green/eventloop/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/green/eventloop
    | creating build/lib.linux-x86_64-cpython-313/zmq/eventloop
    | copying zmq/eventloop/zmqstream.py -> build/lib.linux-x86_64-cpython-313/zmq/eventloop
    | copying zmq/eventloop/ioloop.py -> build/lib.linux-x86_64-cpython-313/zmq/eventloop
    | copying zmq/eventloop/future.py -> build/lib.linux-x86_64-cpython-313/zmq/eventloop
    | copying zmq/eventloop/_deprecated.py -> build/lib.linux-x86_64-cpython-313/zmq/eventloop
    | copying zmq/eventloop/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/eventloop
    | creating build/lib.linux-x86_64-cpython-313/zmq/devices
    | copying zmq/devices/proxysteerabledevice.py -> build/lib.linux-x86_64-cpython-313/zmq/devices
    | copying zmq/devices/proxydevice.py -> build/lib.linux-x86_64-cpython-313/zmq/devices
    | copying zmq/devices/monitoredqueuedevice.py -> build/lib.linux-x86_64-cpython-313/zmq/devices
    | copying zmq/devices/monitoredqueue.py -> build/lib.linux-x86_64-cpython-313/zmq/devices
    | copying zmq/devices/basedevice.py -> build/lib.linux-x86_64-cpython-313/zmq/devices
    | copying zmq/devices/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/devices
    | creating build/lib.linux-x86_64-cpython-313/zmq/backend
    | copying zmq/backend/select.py -> build/lib.linux-x86_64-cpython-313/zmq/backend
    | copying zmq/backend/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/backend
    | creating build/lib.linux-x86_64-cpython-313/zmq/backend/cython
    | copying zmq/backend/cython/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/backend/cython
    | creating build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | copying zmq/backend/cffi/utils.py -> build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | copying zmq/backend/cffi/socket.py -> build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | copying zmq/backend/cffi/message.py -> build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | copying zmq/backend/cffi/error.py -> build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | copying zmq/backend/cffi/devices.py -> build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | copying zmq/backend/cffi/context.py -> build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | copying zmq/backend/cffi/_poll.py -> build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | copying zmq/backend/cffi/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | creating build/lib.linux-x86_64-cpython-313/zmq/auth
    | copying zmq/auth/thread.py -> build/lib.linux-x86_64-cpython-313/zmq/auth
    | copying zmq/auth/ioloop.py -> build/lib.linux-x86_64-cpython-313/zmq/auth
    | copying zmq/auth/certs.py -> build/lib.linux-x86_64-cpython-313/zmq/auth
    | copying zmq/auth/base.py -> build/lib.linux-x86_64-cpython-313/zmq/auth
    | copying zmq/auth/asyncio.py -> build/lib.linux-x86_64-cpython-313/zmq/auth
    | copying zmq/auth/__init__.py -> build/lib.linux-x86_64-cpython-313/zmq/auth
    | copying zmq/__init__.pyi -> build/lib.linux-x86_64-cpython-313/zmq
    | copying zmq/py.typed -> build/lib.linux-x86_64-cpython-313/zmq
    | copying zmq/__init__.pxd -> build/lib.linux-x86_64-cpython-313/zmq
    | copying zmq/utils/buffers.pxd -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/zmq_compat.h -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/pyversion_compat.h -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/mutex.h -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/ipcmaxlen.h -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/getpid_compat.h -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/config.json -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/utils/compiler.json -> build/lib.linux-x86_64-cpython-313/zmq/utils
    | copying zmq/tests/cython_ext.pyx -> build/lib.linux-x86_64-cpython-313/zmq/tests
    | copying zmq/sugar/__init__.pyi -> build/lib.linux-x86_64-cpython-313/zmq/sugar
    | copying zmq/devices/monitoredqueue.pxd -> build/lib.linux-x86_64-cpython-313/zmq/devices
    | copying zmq/backend/__init__.pyi -> build/lib.linux-x86_64-cpython-313/zmq/backend
    | copying zmq/backend/cython/socket.pxd -> build/lib.linux-x86_64-cpython-313/zmq/backend/cython
    | copying zmq/backend/cython/message.pxd -> build/lib.linux-x86_64-cpython-313/zmq/backend/cython
    | copying zmq/backend/cython/libzmq.pxd -> build/lib.linux-x86_64-cpython-313/zmq/backend/cython
    | copying zmq/backend/cython/context.pxd -> build/lib.linux-x86_64-cpython-313/zmq/backend/cython
    | copying zmq/backend/cython/checkrc.pxd -> build/lib.linux-x86_64-cpython-313/zmq/backend/cython
    | copying zmq/backend/cython/__init__.pxd -> build/lib.linux-x86_64-cpython-313/zmq/backend/cython
    | copying zmq/backend/cython/constant_enums.pxi -> build/lib.linux-x86_64-cpython-313/zmq/backend/cython
    | copying zmq/backend/cffi/_cdefs.h -> build/lib.linux-x86_64-cpython-313/zmq/backend/cffi
    | running build_ext
    | running configure
    | Using bundled libzmq
    | already have bundled/zeromq
    | already have platform.hpp
    | checking for timer_create
    | x86_64-linux-gnu-gcc -fno-strict-overflow -Wsign-compare -DNDEBUG -g -O2 -Wall -fPIC -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c /tmp/timer_create1n8hrpfe.c -o tmp/timer_create1n8hrpfe.o
    | x86_64-linux-gnu-gcc tmp/timer_create1n8hrpfe.o -L/usr/lib/x86_64-linux-gnu -o a.out
    | ok
    | ************************************************
    | ************************************************
    | ************************************************
    | building 'zmq.libzmq' extension
    | creating build/temp.linux-x86_64-cpython-313/buildutils
    | creating build/temp.linux-x86_64-cpython-313/bundled/zeromq/src
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c buildutils/initlibzmq.cpp -o build/temp.linux-x86_64-cpython-313/buildutils/initlibzmq.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/address.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/address.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/channel.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/channel.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/client.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/client.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/clock.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/clock.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/ctx.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/ctx.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/curve_client.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/curve_client.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/curve_mechanism_base.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/curve_mechanism_base.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/curve_server.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/curve_server.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/dealer.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/dealer.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/decoder_allocators.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/decoder_allocators.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/devpoll.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/devpoll.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/dgram.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/dgram.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/dish.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/dish.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/dist.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/dist.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/endpoint.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/endpoint.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/epoll.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/epoll.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/err.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/err.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/fq.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/fq.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/gather.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/gather.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/gssapi_client.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/gssapi_client.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/gssapi_mechanism_base.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/gssapi_mechanism_base.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/gssapi_server.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/gssapi_server.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/io_object.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/io_object.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/io_thread.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/io_thread.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/ip.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/ip.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/ip_resolver.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/ip_resolver.o
    | x86_64-linux-gnu-g++ -std=c++11 -std=c++11 -fPIC -DZMQ_HAVE_CURVE=1 -DZMQ_USE_TWEETNACL=1 -DZMQ_USE_EPOLL=1 -DZMQ_IOTHREADS_USE_EPOLL=1 -DZMQ_POLL_BASED_ON_POLL=1 -Ibundled/zeromq/include -Ibundled -I/tmp/tmpc4qlqwn5/.venv/include -I/usr/include/python3.13 -c bundled/zeromq/src/ipc_address.cpp -o build/temp.linux-x86_64-cpython-313/bundled/zeromq/src/ipc_address.o
    | In file included from bundled/zeromq/src/ipc_address.cpp:31:
    | bundled/zeromq/src/compat.hpp:45:1: error: ‘size_t strlcpy(char*, const char*, size_t)’ was declared ‘extern’ and later ‘static’ [-fpermissive]
    |    45 | strlcpy (char *dest_, const char *src_, const size_t dest_size_)
    |       | ^~~~~~~
    | In file included from bundled/zeromq/src/compat.hpp:34:
    | /usr/include/string.h:506:15: note: previous declaration of ‘size_t strlcpy(char*, const char*, size_t)’
    |   506 | extern size_t strlcpy (char *__restrict __dest,
    |       |               ^~~~~~~
    | error: command '/usr/bin/x86_64-linux-gnu-g++' failed with exit code 1

Note: This error originates from the build backend, and is likely not a problem with poetry but one of the following issues with pyzmq (25.1.2)

  - not supporting PEP 517 builds
  - not specifying PEP 517 build requirements correctly
  - the build requirements are incompatible with your operating system or Python version
  - the build requirements are missing system dependencies (eg: compilers, libraries, headers).

You can verify this by running pip wheel --no-cache-dir --use-pep517 "pyzmq (==25.1.2)".

  - Installing tornado (6.5.4)
  - Installing webencodings (0.5.1)