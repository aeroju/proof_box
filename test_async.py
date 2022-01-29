"""
This gist shows how to run asyncio loop in a separate thread.
It could be useful if you want to mix sync and async code together.
Python 3.7+
"""
import asyncio
from datetime import datetime
from threading import Thread
from typing import Tuple, List, Iterable

import httpx

URLS = [
    "https://pypi.org",
    "https://python.org",
    "https://google.com",
    "https://amazon.com",
    "https://reddit.com",
    "https://stackoverflow.com",
    "https://ubuntu.com",
    "https://github.com",
    "https://microsoft.com",
]


def start_background_loop(loop: asyncio.AbstractEventLoop) -> None:
    asyncio.set_event_loop(loop)
    loop.run_forever()


async def fetch(url: str) -> Tuple[str, int]:
    """Does HTTP get on url and returns url and status code"""
    async with httpx.AsyncClient() as session:
        response = await session.get(url)
        return url, response.status_code


async def fetch_all_urls(urls: Iterable[str]) -> List[Tuple[str, int]]:
    """Fetch all urls from the list of urls
    It is done concurrently and combined into a single coroutine"""
    tasks = [asyncio.create_task(fetch(url)) for url in urls]
    results = await asyncio.gather(*tasks)
    return results

async def run_a_while(stop_sign):
    times=0
    while(not stop_sign.is_set()):
        print('runing for {} times'.format(times))
        times+=1
        await asyncio.sleep(2)


def main() -> None:
    loop = asyncio.new_event_loop()
    stop_sign=asyncio.Event()
    t = Thread(target=start_background_loop, args=(loop,), daemon=True)
    t.start()

    start_time = datetime.now()

    task = asyncio.run_coroutine_threadsafe(fetch_all_urls(URLS), loop)
    for url, status_code in task.result():
        print(f"{url} -> {status_code}")

    task = loop.create_task(run_a_while(stop_sign))
    import time

    time.sleep(10)
    stop_sign.set()

    exec_time = (datetime.now() - start_time).total_seconds()
    print(f"It took {exec_time:,.2f} seconds to run")
    loop.stop()


if __name__ == "__main__":
    main()